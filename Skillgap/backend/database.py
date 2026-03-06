from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, JSON, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

SQLALCHEMY_DATABASE_URL = "sqlite:///./skillgraph.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Association table for Skill Dependencies (Prerequisites)
skill_dependencies = Table(
    'skill_dependencies', Base.metadata,
    Column('skill_id', Integer, ForeignKey('skills.id'), primary_key=True),
    Column('prerequisite_id', Integer, ForeignKey('skills.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    career_goal_id = Column(Integer, ForeignKey("job_roles.id"))
    xp = Column(Integer, default=0)
    
    skills = relationship("UserSkill", back_populates="user")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    category = Column(String) # e.g., "Programming", "Mathematics", "Tools"
    
    # Self-referential relationship for dependencies
    prerequisites = relationship(
        "Skill",
        secondary=skill_dependencies,
        primaryjoin=id == skill_dependencies.c.skill_id,
        secondaryjoin=id == skill_dependencies.c.prerequisite_id,
        backref="required_for"
    )

class JobRole(Base):
    __tablename__ = "job_roles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    description = Column(String)
    market_demand = Column(String) # e.g., "+34% Growth"
    salary_range = Column(String) # e.g., "$120k - $180k"
    top_skills = Column(JSON) # List of skill IDs or names

class UserSkill(Base):
    __tablename__ = "user_skills"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    level = Column(Integer, default=1) # 1-10
    verified = Column(Integer, default=0) # 0 or 1
    
    user = relationship("User", back_populates="skills")
    skill = relationship("Skill")

class AssessmentItem(Base):
    __tablename__ = "assessment_items"
    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    question = Column(String)
    options = Column(JSON)
    correct_answer = Column(String)
    difficulty = Column(String) # "Beginner", "Intermediate", "Hard"

class UserAssessmentResult(Base):
    __tablename__ = "user_assessment_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    score = Column(Float)
    timestamp = Column(String)
    details = Column(JSON)

Base.metadata.create_all(bind=engine)
