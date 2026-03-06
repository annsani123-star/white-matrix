from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from database import SessionLocal, engine, Base, User, Skill, JobRole, UserSkill
from graph_service import graph_service
from assessment_service import assessment_service
from ai_mentor import ai_mentor
from market_intel import market_intel_engine

app = FastAPI(title="SkillGraph AI - Full Model API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Seed data function
def seed_data(db: Session):
    # Add Skills
    skills = [
        Skill(name="Python", category="Programming", description="Core language for AI"),
        Skill(name="Mathematics", category="Science", description="Linear Algebra & Calculus"),
        Skill(name="Neural Networks", category="AI", description="Deep Learning foundations"),
        Skill(name="MLOps", category="Tools", description="Model deployment & monitoring"),
        Skill(name="Docker", category="Tools", description="Containerization for models"),
    ]
    for s in skills:
        if not db.query(Skill).filter(Skill.name == s.name).first():
            db.add(s)
    db.commit()

    # Add Dependencies
    py = db.query(Skill).filter(Skill.name == "Python").first()
    nn = db.query(Skill).filter(Skill.name == "Neural Networks").first()
    ma = db.query(Skill).filter(Skill.name == "Mathematics").first()
    mo = db.query(Skill).filter(Skill.name == "MLOps").first()
    dk = db.query(Skill).filter(Skill.name == "Docker").first()

    if nn and py not in nn.prerequisites: nn.prerequisites.append(py)
    if nn and ma not in nn.prerequisites: nn.prerequisites.append(ma)
    if mo and dk not in mo.prerequisites: mo.prerequisites.append(dk)
    db.commit()

    # Add Job Role
    if not db.query(JobRole).filter(JobRole.title == "AI Engineer").first():
        role = JobRole(
            title="AI Engineer",
            description="Builds and deploys intelligent systems",
            market_demand="+34% Growth",
            salary_range="$120k - $180k",
            top_skills=["Python", "Neural Networks", "MLOps"]
        )
        db.add(role)
        db.commit()

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    seed_data(db)
    db.close()

@app.get("/")
async def root():
    return {"message": "SkillGraph AI API is active. Ready for professional insights. 🚀"}

@app.get("/user/progress")
async def get_progress(db: Session = Depends(get_db)):
    # Mock user for now, in real app we'd use auth
    return {
        "user": "Alex",
        "goal": "AI Engineer",
        "progress": 42,
        "skills": ["Python", "Mathematics"],
        "gaps": [
            {"skill": "Neural Networks", "gap": 4},
            {"skill": "MLOps", "gap": 7}
        ]
    }

@app.get("/roadmap/{goal}")
async def get_roadmap(goal: str, db: Session = Depends(get_db)):
    roadmap = graph_service.get_roadmap(db, goal)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Goal not found")
    return roadmap

@app.get("/mentor/advice")
async def get_advice(db: Session = Depends(get_db)):
    mock_profile = {"gaps": [{"skill": "Neural Networks"}]}
    return {"advice": ai_mentor.get_advice(mock_profile)}

@app.get("/market-demand/{role}")
async def get_market_demand(role: str, db: Session = Depends(get_db)):
    job = db.query(JobRole).filter(JobRole.title == role).first()
    if not job:
        raise HTTPException(status_code=404, detail="Role not found")
    return {
        "demand_growth": job.market_demand,
        "top_skills": job.top_skills,
        "salary_trend": job.salary_range
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

