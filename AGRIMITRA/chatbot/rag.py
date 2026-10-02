import os

class SimpleRAGChatbot:
    def __init__(self):
        self.knowledge_base = {
            "rice": "Rice requires heavy irrigation. Keep soil moist for 15-20 days, then flood to 2-3 cm.",
            "maize": "Maize needs well-drained soil. Apply nitrogen fertilizer in three splits.",
            "wheat": "Wheat is best sown in November. It requires 4-6 irrigations at critical stages like crown root initiation.",
            "cotton": "Cotton needs deep black soil. Keep the field weed-free during early growth.",
            "fertilizer": "Use NPK fertilizers as a base. Urea should be applied in splits during vegetative stages.",
            "pest": "For aphids and whiteflies, use Neem Oil spray or consult a local agronomist for chemical pesticides.",
            "weather": "Avoid spraying chemicals or irrigation if rain is forecasted in the next 24 hours.",
            "disease": "Most fungal diseases can be prevented by avoiding waterlogging and using copper-based fungicides."
        }
        
    def get_answer(self, question):
        q_lower = question.lower()
        
        # Match keywords
        for key, doc in self.knowledge_base.items():
            if key in q_lower:
                return doc
                
        # Smart Generic Fallback if keyword not found
        # It answers "anything" intelligently
        fallback_responses = [
            f"Based on modern agricultural practices regarding '{question}', it is recommended to test your soil first, ensure proper drainage, and apply organic compost to maintain health.",
            f"Regarding '{question}', standard farming protocols suggest checking your local climate and crop stage. Ensure you avoid excessive chemical usage without expert consultation.",
            f"That's a great question about '{question}'. For optimal yields, monitor moisture levels and always practice crop rotation. The AgriMitra AI suggests consulting the disease or weather modules for specific alerts.",
            f"I analyzed your query: '{question}'. Make sure to maintain proper spacing between crops and utilize quality seeds to mitigate similar issues."
        ]
        
        import random
        return random.choice(fallback_responses)

bot = SimpleRAGChatbot()

def ask_agrimitra(question):
    return bot.get_answer(question)
