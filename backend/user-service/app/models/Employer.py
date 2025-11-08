from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Text
from sqlalchemy.orm import relationship
from db import Base
from .Employee import Employee

class Employer(Base):
    __tablename__ = "employers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), 
                    nullable=False, #company can't exist without owner
                    unique=True #owner can have only only one company
                    )

    # relationships

    #list of users (note: on delete company we set users.employer_id to NULL;
    users = relationship("User", back_populates="employer", cascade="all, delete-orphan", foreign_keys="[User.employer_id]")
    employees = relationship("Employee", back_populates="employer", cascade="all, delete-orphan")

    # owner: use post_update to allow circular creation without manual two-step
    owner = relationship("User", foreign_keys=[owner_id], post_update=True) 