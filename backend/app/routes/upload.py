from fastapi import APIRouter, UploadFile
import cloudinary.uploader

router = APIRouter()

@router.post("/upload/")
async def upload_file(file: UploadFile):
    """
    Uploads a file (PDF, image, DOCX) to Cloudinary.
    Returns a public URL.
    """
    result = cloudinary.uploader.upload(file.file, resource_type="auto")
    return {"url": result['secure_url']}
