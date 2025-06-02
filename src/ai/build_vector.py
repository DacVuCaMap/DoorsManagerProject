import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer
import os
import json

# Cấu hình
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(SCRIPT_DIR, "phongthuycut.pdf")
CHUNK_SIZE = 500
EMBED_MODEL = "BAAI/bge-small-en-v1.5"
OUTPUT_JSON = os.path.join(SCRIPT_DIR, "phongthuy_vectors.json")

def extract_text(pdf_path):
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File không tồn tại: {pdf_path}")
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def split_chunks(text, size=500):
    words = text.split()
    return [" ".join(words[i:i+size]) for i in range(0, len(words), size)]

def build_vector_store():
    print("▶️ Đang đọc PDF...")
    text = extract_text(PDF_PATH)
    chunks = split_chunks(text, CHUNK_SIZE)

    print("✅ Đang tạo embedding...")
    model = SentenceTransformer(EMBED_MODEL)

    # Tạo danh sách vector và tài liệu
    vectors = []
    for i, chunk in enumerate(chunks):
        emb = model.encode(chunk).tolist()
        vectors.append({"id": str(i), "document": chunk, "embedding": emb})

    # Lưu vào file JSON
    print("✅ Đang lưu vào file JSON...")
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(vectors, f, ensure_ascii=False, indent=2)

    print(f"✅ Hoàn tất! Đã lưu {len(chunks)} đoạn vào {OUTPUT_JSON}")

if __name__ == "__main__":
    build_vector_store()