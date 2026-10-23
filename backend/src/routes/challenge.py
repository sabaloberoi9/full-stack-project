from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.ai_generator import generate_challenge_with_ai
from src.database import models
from src.database.db import get_db
from src.utils import authenticate_and_get_user_details

router = APIRouter()

DAILY_QUOTA = 5


class ChallengeRequest(BaseModel):
  difficulty: str
  topic: str = "Programming"


class AnswerSubmission(BaseModel):
  selected_option: int


def get_daily_usage(db: Session, user_id: str) -> int:
  twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=24)
  return (
      db.query(models.Challenge)
      .filter(
          models.Challenge.user_id == user_id,
          models.Challenge.created_at >= twenty_four_hours_ago,
      )
      .count()
  )


@router.post("/generate-challenge")
async def generate_challenge(
    request: Request,
    challenge_request: ChallengeRequest,
    db: Session = Depends(get_db),
):
  user_details = authenticate_and_get_user_details(request)
  user_id = user_details.get("user_id")

  usage = get_daily_usage(db, user_id)
  if usage >= DAILY_QUOTA:
    raise HTTPException(
        status_code=429,
        detail="Daily challenge quota reached. Please try again tomorrow.",
    )

  challenge_data = generate_challenge_with_ai(
      difficulty=challenge_request.difficulty,
      topic=challenge_request.topic,
  )

  new_challenge = models.Challenge(
      difficulty=challenge_request.difficulty,
      title=challenge_data["title"],
      options=challenge_data["options"],
      correct_answer_id=challenge_data["correct_answer_id"],
      explanation=challenge_data["explanation"],
      user_id=user_id,
  )

  db.add(new_challenge)
  db.commit()
  db.refresh(new_challenge)

  return {
      "challenge": new_challenge,
      "quota_remaining": max(0, DAILY_QUOTA - (usage + 1)),
  }


@router.patch("/challenges/{challenge_id}/answer")
async def record_answer(
    challenge_id: int,
    submission: AnswerSubmission,
    request: Request,
    db: Session = Depends(get_db),
):
  user_details = authenticate_and_get_user_details(request)
  user_id = user_details.get("user_id")

  challenge = (
      db.query(models.Challenge)
      .filter(
          models.Challenge.id == challenge_id,
          models.Challenge.user_id == user_id,
      )
      .first()
  )

  if not challenge:
    raise HTTPException(status_code=404, detail="Challenge not found")

  challenge.selected_option = submission.selected_option
  challenge.is_correct = (
      1 if submission.selected_option == challenge.correct_answer_id else 0
  )

  db.commit()
  db.refresh(challenge)

  return {
      "message": "Answer recorded successfully",
      "challenge_id": challenge.id,
      "is_correct": bool(challenge.is_correct),
  }


@router.get("/stats")
async def get_user_stats(request: Request, db: Session = Depends(get_db)):
  user_details = authenticate_and_get_user_details(request)
  user_id = user_details.get("user_id")

  total_answered = (
      db.query(models.Challenge)
      .filter(
          models.Challenge.user_id == user_id,
          models.Challenge.selected_option != None,
      )
      .count()
  )

  total_correct = (
      db.query(models.Challenge)
      .filter(
          models.Challenge.user_id == user_id,
          models.Challenge.is_correct == 1,
      )
      .count()
  )

  accuracy = (
      round((total_correct / total_answered) * 100, 1)
      if total_answered > 0
      else 0.0
  )

  return {
      "total_answered": total_answered,
      "total_correct": total_correct,
      "accuracy": accuracy,
  }


@router.get("/quota")
async def get_quota(request: Request, db: Session = Depends(get_db)):
  user_details = authenticate_and_get_user_details(request)
  user_id = user_details.get("user_id")

  usage = get_daily_usage(db, user_id)
  quota_remaining = max(0, DAILY_QUOTA - usage)
  return {"quota_remaining": quota_remaining}


@router.get("/my-history")
async def get_history(request: Request, db: Session = Depends(get_db)):
  user_details = authenticate_and_get_user_details(request)
  user_id = user_details.get("user_id")

  challenges = (
      db.query(models.Challenge)
      .filter(models.Challenge.user_id == user_id)
      .order_by(models.Challenge.created_at.desc())
      .all()
  )
  return {"challenges": challenges}