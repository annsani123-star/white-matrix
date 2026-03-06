from typing import Dict

class AIMentor:
    def get_advice(self, user_profile: Dict):
        gaps = user_profile.get("gaps", [])
        if not gaps:
            return "You are doing great! Keep building projects."
        
        top_gap = gaps[0]["skill"]
        return f"You currently have some gaps in {top_gap}. I recommend building an Image Classification project to strengthen your Neural Networks skills."

ai_mentor = AIMentor()
