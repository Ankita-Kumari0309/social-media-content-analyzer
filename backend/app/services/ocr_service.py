# services/ocr_service.py

import requests
import concurrent.futures
from fastapi import HTTPException
from pathlib import Path


class OCRService:
    def __init__(self, api_key: str):
        """
        OCR Service using OCR.Space API (cloud-based).
        This works for deployment without installing Tesseract.
        """
        if not api_key:
            raise ValueError("OCR API key is required")
        self.api_key = api_key
        self.ocr_url = "https://api.ocr.space/parse/image"

    def _extract_text(self, file_path: str) -> str:
        try:
            if not Path(file_path).exists():
                raise HTTPException(status_code=400, detail="File not found")

            with open(file_path, "rb") as f:
                files = {"file": f}
                payload = {
                    "apikey": self.api_key,
                    "OCREngine": 2,  # Use OCR Engine 2 for better accuracy
                    "language": "eng",
                }

                response = requests.post(self.ocr_url, files=files, data=payload)
                result = response.json()

                if result.get("IsErroredOnProcessing"):
                    raise HTTPException(
                        status_code=500,
                        detail=f"OCR failed: {result.get('ErrorMessage', 'Unknown error')}"
                    )

                parsed_results = result.get("ParsedResults")
                if not parsed_results:
                    return ""

                text = parsed_results[0].get("ParsedText", "")
                return text.strip()

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")

    def extract_text_with_timeout(self, file_path: str, timeout: int = 15) -> str:
        try:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(self._extract_text, file_path)
                return future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            raise HTTPException(status_code=408, detail="OCR processing timed out")
