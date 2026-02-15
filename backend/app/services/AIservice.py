# services/AIservice.py

import google.generativeai as genai
import concurrent.futures
from fastapi import HTTPException


class AIService:

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name="gemini-2.5-flash-lite")

    def _analyze(self, text: str) -> str:
        prompt = f"""
You are a social media strategist.

Analyze this social media post and provide:
1. Tone
2. Engagement strengths
3. Weaknesses
4. Improvements
5. Optimized rewritten version
6. Suggested hashtags (5-10)

Post:
{text[:4000]}
"""
        response = self.model.generate_content(prompt)

        if not response or not response.text:
            raise Exception("Empty AI response")

        return response.text

    def analyze_with_timeout(self, text: str, timeout: int = 30) -> dict:
        try:
            if not text.strip():
                raise HTTPException(status_code=400, detail="No text for AI analysis")

            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(self._analyze, text)
                result = future.result(timeout=timeout)

            return {
                "analysis_type": "ai-based",
                "result": result
            }

        except concurrent.futures.TimeoutError:
            raise HTTPException(status_code=408, detail="AI processing timed out")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
