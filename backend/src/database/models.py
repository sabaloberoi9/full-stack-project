from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Integer, JSON, String, Text
from src.database.db import Base


class Challenge(Base):
  __tablename__ = "challenges"

  id = Column(Integer, primary_key=True, index=True)
  difficulty = Column(String, nullable=False)
  title = Column(String, nullable=False)
  options = Column(JSON, nullable=False)
  correct_answer_id = Column(Integer, nullable=False)
  explanation = Column(Text, nullable=False)
  user_id = Column(String, nullable=False, index=True)
  selected_option = Column(Integer, nullable=True)
  is_correct = Column(Integer, default=0)
  created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))