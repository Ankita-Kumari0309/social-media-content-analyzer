# services/pdf_service.py

import fitz  # PyMuPDF
import concurrent.futures
from fastapi import HTTPException
from docx import Document


class PDFService:

    # ---------------- PDF Extraction ----------------
    def _extract_text(self, file_path: str) -> str:
        try:
            text = ""
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
            return text.strip()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")

    def extract_text_with_timeout(self, file_path: str, timeout: int = 20) -> str:
        try:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(self._extract_text, file_path)
                return future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            raise HTTPException(status_code=408, detail="PDF processing timed out")

    # ---------------- DOCX Extraction ----------------
    def extract_text_from_docx(self, file_path: str) -> str:
        try:
            doc = Document(file_path)
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text.strip()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"DOCX extraction failed: {str(e)}")
