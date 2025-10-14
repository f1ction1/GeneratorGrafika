from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Text
from sqlalchemy.orm import relationship
from db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # owner / manager / platform_admin
    employer_id = Column(Integer, ForeignKey("employers.id", ondelete="CASCADE"), nullable=True)

    employer = relationship("Employer", back_populates="users")