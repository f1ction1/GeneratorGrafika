from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.User import User
from schemas.auth import UserUpdate

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def update_user(self, user_id: int, data: UserUpdate):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # Check if email is used by another user
        email_user = self.db.query(User).filter(User.email == data.email, User.id != user_id).first()
        if email_user:
            raise HTTPException(status_code=400, detail="Email is already in use by another user")
        user.first_name = data.first_name
        user.last_name = data.last_name
        user.email = data.email
        self.db.commit()
        self.db.refresh(user)
        return user
