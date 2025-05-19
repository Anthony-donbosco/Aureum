import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.orm import relationship
from ..db_config import Base


class UserType(str, enum.Enum):
    PERSONAL = "personal"
    BUSINESS = "business"


class User(Base):
    """
    Modelo para representar a un usuario de la aplicación.
    """
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    type = Column(Enum(UserType), default=UserType.PERSONAL)
    birthdate = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    transactions = relationship("Transaction", back_populates="user")

    def __repr__(self):
        return f"<User {self.email}>"