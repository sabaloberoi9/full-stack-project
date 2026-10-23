import os
from pathlib import Path
from clerk_backend_api import Clerk
from clerk_backend_api.security import AuthenticateRequestOptions
from dotenv import load_dotenv
from fastapi import HTTPException

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))


def authenticate_and_get_user_details(request):
  print("--> [Clerk] Starting request authentication...")
  try:
    options = AuthenticateRequestOptions(
        authorized_parties=["http://localhost:5173", "http://localhost:5174"],
        jwt_key=os.getenv("JWT_KEY"),
    )
    print("--> [Clerk] Calling clerk_sdk.authenticate_request...")
    request_state = clerk_sdk.authenticate_request(request, options)
    print(f"--> [Clerk] Signed in status: {request_state.is_signed_in}")

    if not request_state.is_signed_in:
      raise HTTPException(
          status_code=401, detail="Invalid token: user not signed in"
      )

    user_id = request_state.payload.get("sub")
    print(f"--> [Clerk] Authenticated user_id: {user_id}")
    return {"user_id": user_id}

  except HTTPException:
    raise
  except Exception as e:
    print(f"--> [Clerk ERROR] Authentication failure: {e}")
    raise HTTPException(status_code=401, detail=f"Authentication failed: {e}")