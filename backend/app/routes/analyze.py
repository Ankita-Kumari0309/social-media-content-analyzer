# routes/analyze.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import os

from app.services.ocr_service import OCRService
from app.services.pdf_service import PDFService
from app.services.rule_engine import RuleEngine
from app.services.AIservice import AIService

from app.utils.config import settings

router = APIRouter(prefix="/analyze", tags=["Analyze"])

@router.post("/")
async def analyze_document(
    file: UploadFile = File(...),
    mode: str = Form(...)
):
    if mode not in ["rule", "ai"]:
        raise HTTPException(status_code=400, detail="Mode must be 'rule' or 'ai'")

    contents = await file.read()

    if not contents:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    # Save temporary file
    with tempfile.NamedTemporaryFile(delete=False) as temp:
        temp.write(contents)
        temp_path = temp.name

    try:
        # Initialize services
        ocr_service = OCRService(settings.OCR_API_KEY)  # Use cloud OCR API
        pdf_service = PDFService()
        rule_engine = RuleEngine()
        ai_service = AIService(settings.GEMINI_API_KEY)

        filename = file.filename.lower()

        # Extract text based on file type
        if filename.endswith(".pdf"):
            text = pdf_service.extract_text_with_timeout(temp_path)
        elif filename.endswith(".docx"):
            text = pdf_service.extract_text_from_docx(temp_path)
        elif filename.endswith((".png", ".jpg", ".jpeg")):
            text = ocr_service.extract_text_with_timeout(temp_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        # Analyze text
        if mode == "rule":
            result = rule_engine.analyze(text)
        else:
            result = ai_service.analyze_with_timeout(text)

        return JSONResponse(
            status_code=200,
            content={
                "filename": file.filename,
                "mode": mode,
                "analysis": result
            }
        )

    finally:
        os.remove(temp_path)
