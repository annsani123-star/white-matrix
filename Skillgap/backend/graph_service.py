from sqlalchemy.orm import Session
from database import Skill, JobRole, UserSkill

class SkillGraphService:
    def get_related_skills(self, db: Session, skill_name: str):
        skill = db.query(Skill).filter(Skill.name == skill_name).first()
        if not skill:
            return []
        return [s.name for s in skill.required_for]

    def get_roadmap(self, db: Session, goal_title: str):
        job_role = db.query(JobRole).filter(JobRole.title == goal_title).first()
        if not job_role:
            return []
        
        # Simplified roadmap generation logic based on JobRole top_skills
        # In a real app, this would perform a topological sort of dependencies
        phases = [
            {"phase": "Foundations", "skills": ["Python", "Mathematics"]},
            {"phase": "Core Competencies", "skills": job_role.top_skills[:2] if job_role.top_skills else []},
            {"phase": "Advanced Specialization", "skills": job_role.top_skills[2:] if job_role.top_skills and len(job_role.top_skills) > 2 else []}
        ]
        return phases

    def get_skill_dependencies(self, db: Session, skill_id: int):
        skill = db.query(Skill).filter(Skill.id == skill_id).first()
        if not skill:
            return []
        return [p.name for p in skill.prerequisites]

graph_service = SkillGraphService()
