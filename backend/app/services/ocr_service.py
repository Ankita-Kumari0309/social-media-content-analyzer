# services/ocr_service.py

import pytesseract
from PIL import Image
import concurrent.futures
from fastapi import HTTPException


class OCRService:

    def __init__(self, tesseract_path: str):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path

    def _extract_text(self, file_path: str) -> str:
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
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
