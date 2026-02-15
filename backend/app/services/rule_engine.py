# services/rule_engine.py

import re
from fastapi import HTTPException


class RuleEngine:

    def __init__(self):
        self.hashtag_pattern = r"#\w+"
        self.url_pattern = r"https?://\S+"
        self.cta_keywords = ["click", "follow", "share", "comment", "like", "subscribe"]

    def analyze(self, text: str) -> dict:
        try:
            if not text or text.strip() == "":
                raise ValueError("No text available for analysis")

            word_count = len(text.split())
            hashtags = re.findall(self.hashtag_pattern, text)
            urls = re.findall(self.url_pattern, text)
            has_cta = any(keyword in text.lower() for keyword in self.cta_keywords)

            suggestions = []

            if word_count < 20:
                suggestions.append("Post is too short. Add more context or value.")

            if len(hashtags) < 3:
                suggestions.append("Add more relevant hashtags to improve reach.")

            if not has_cta:
                suggestions.append("Include a call-to-action like 'Follow us' or 'Share this'.")

            engagement_score = 100
            if word_count < 20:
                engagement_score -= 15
            if len(hashtags) < 3:
                engagement_score -= 15
            if not has_cta:
                engagement_score -= 10

            engagement_score = max(0, engagement_score)

            return {
                "analysis_type": "rule-based",
                "metrics": {
                    "word_count": word_count,
                    "hashtag_count": len(hashtags),
                    "url_count": len(urls),
                    "cta_present": has_cta
                },
                "engagement_score": engagement_score,
                "suggestions": suggestions
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
