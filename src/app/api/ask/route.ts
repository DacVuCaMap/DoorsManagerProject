import { NextResponse } from "next/server";
import { pipeline, type Pipeline, env } from "@xenova/transformers";
import fs from "fs/promises";
import path from "path";

// Cấu hình backend WebAssembly
env.allowLocalModels = false; // Vô hiệu hóa backend native
env.backends.onnx = require("onnxruntime-web");
env.backends.onnx.locateFile = (file: string) => {
  return path.join(process.cwd(), "node_modules", "onnxruntime-web", "dist", file);
};

interface Vector {
  id: string;
  document: string;
  embedding: number[];
}

interface RequestBody {
  question: string;
}

const vectorsPath = path.join(process.cwd(), "src", "ai", "phongthuy_vectors.json");

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
}

async function queryVectors(questionEmbedding: number[], nResults: number = 5): Promise<Vector[]> {
  const vectors: Vector[] = JSON.parse(await fs.readFile(vectorsPath, "utf-8"));
  const similarities = vectors.map((vector) => ({
    ...vector,
    similarity: cosineSimilarity(questionEmbedding, vector.embedding),
  }));
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, nResults);
}

export async function POST(request: Request) {
  try {
    const { question }: RequestBody = await request.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Tạo embedding
    console.log("Loading transformer model...");
    const embedder = await pipeline("feature-extraction", "Xenova/bge-small-en-v1.5");
    console.log("Generating embedding...");
    const questionOutput = await (embedder as Pipeline)(question, {
      pooling: "mean",
      normalize: true,
    });
    const questionEmbedding: number[] = Array.from(questionOutput.data);

    // Truy vấn vector
    console.log("Querying vectors...");
    const results = await queryVectors(questionEmbedding, 5);
    const context = results.map((r) => r.document).join("\n");

    // Gọi OpenRouter API
    console.log("Calling OpenRouter API...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content:
              "Bạn là chuyên gia phong thủy, trả lời đúng theo tài liệu dưới đây. Hãy trả lời như một nhân viên chăm sóc, xưng em và gọi khách là anh/chị.",
          },
          {
            role: "user",
            content: `Tài liệu:\n${context}\n\nCâu hỏi: ${question}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Error from OpenRouter API");
    }

    const answer: string = data.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}