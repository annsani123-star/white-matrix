from sqlalchemy.orm import Session
from database import UserSkill, Skill, AssessmentItem, UserAssessmentResult
from typing import List, Dict
import json

class AssessmentService:
    def evaluate_knowledge(self, db: Session, user_id: int, skill_id: int, answers: Dict):
        # In a real app, logic would compare answers with AssessmentItem correct_answers
        score = 0.85 # Mocking a successful assessment
        
        result = UserAssessmentResult(
            user_id=user_id,
            skill_id=skill_id,
            score=score * 100,
            timestamp="2024-03-07",
            details=answers
        )
        db.add(result)
        
        # Update user skill level
        user_skill = db.query(UserSkill).filter(UserSkill.user_id == user_id, UserSkill.skill_id == skill_id).first()
        if user_skill:
            user_skill.level = max(user_skill.level, 7) # Level up to 7 for passing
            user_skill.verified = 1
        else:
            new_skill = UserSkill(user_id=user_id, skill_id=skill_id, level=7, verified=1)
            db.add(new_skill)
            
        db.commit()
        return {"skill_id": skill_id, "score": score * 100, "verified": True}

    def detect_gaps(self, db: Session, user_id: int, goal_id: int):
        # Get target skills for the job role
        # Simplified: in real app, fetch from JobRole table
        required_skills = ["Python", "Neural Networks", "MLOps"] 
        
        user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        user_skill_map = {db.query(Skill).get(us.skill_id).name: us.level for us in user_skills}
        
        gaps = []
        for req in required_skills:
            current_level = user_skill_map.get(req, 0)
            if current_level < 8:
                gaps.append({
                    "skill": req,
                    "gap": 8 - current_level,
                    "priority": (8 - current_level) * 2
                })
        return sorted(gaps, key=lambda x: x["priority"], reverse=True)

assessment_service = AssessmentService()
