import json
import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

SYSTEM_PROMPT = """You are an expert coding challenge creator.
Generate a coding question with multiple-choice answers for the given difficulty level and technical topic.

Return ONLY a valid JSON object matching this exact schema:
{
  "title": "Question prompt text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer_id": 0,
  "explanation": "Why this option is correct."
}
"""


def generate_challenge_with_ai(
    difficulty: str, topic: str = "Python Programming"
) -> dict:
  fallback = {
      "title": (
          "Which data structure operates on a First-In, First-Out (FIFO) basis?"
      ),
      "options": ["Stack", "Queue", "Binary Tree", "Heap"],
      "correct_answer_id": 1,
      "explanation": "A Queue operates on FIFO principles.",
  }

  try:
    response = client.chat.completions.create(
        model="gemini-3.5-flash-lite",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Generate a unique {difficulty} difficulty coding question"
                    f" focused specifically on {topic}."
                ),
            },
        ],
        response_format={"type": "json_object"},
        temperature=0.8,
    )

    content = response.choices[0].message.content
    challenge_data = json.loads(content)

    required = ["title", "options", "correct_answer_id", "explanation"]
    for key in required:
      if key not in challenge_data:
        raise ValueError(f"Missing required key: {key}")

    return challenge_data

  except Exception as e:
    print(f"Generation error: {e}")
    return fallback