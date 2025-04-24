from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean, Enum, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

# Base para los modelos SQLAlchemy
Base = declarative_base()