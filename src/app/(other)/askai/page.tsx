"use client";

import { useState, FormEvent } from "react";

interface ResponseData {
  answer?: string;
  error?: string;
}

export default function Home() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data: ResponseData = await res.json();
      if (data.error) {
        setAnswer(`Lỗi: ${data.error}`);
      } else {
        setAnswer(data.answer || "Không có câu trả lời");
      }
    } catch (error) {
      setAnswer("Đã xảy ra lỗi, vui lòng thử lại!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-600">
          Hỏi Chuyên Gia Phong Thủy
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition flex items-center justify-center"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Đang xử lý..." : "Gửi"}
            </button>
          </div>
        </form>
        {answer && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Trả lời:</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}