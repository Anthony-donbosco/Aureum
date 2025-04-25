import os
from typing import Optional, Dict, Any, List
from pydantic import BaseSettings, Field
import logging
import secrets

class Settings(BaseSettings):
    """
    Configuración global usando pydantic
    """
    # Configuración general
    APP_NAME: str = "Aureum API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, env="DEBUG")
    
    # Seguridad
    SECRET_KEY: str = Field(default_factory=lambda: secrets.token_urlsafe(32), env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas
    
    # Base de datos
    DATABASE_URL: str = Field(default="sqlite:///./aureum.db", env="DATABASE_URL")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

# Crear instancia de configuración global
settings = Settings()

# Configuración de logging
logging_levels = {
    "DEBUG": logging.DEBUG,
    "INFO": logging.INFO,
    "WARNING": logging.WARNING,
    "ERROR": logging.ERROR,
    "CRITICAL": logging.CRITICAL
}

def configure_logging():
    """
    Configura el sistema de logging
    """
    log_level = logging_levels.get(settings.LOG_LEVEL, logging.INFO)
    
    # Configuración básica
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(),  # Para consola
            logging.FileHandler("aureum.log")  # Para archivo
        ]
    )
    
    # Configurar nivel para bibliotecas externas
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.WARNING)
    
    # Crear logger para la aplicación
    logger = logging.getLogger("aureum")
    logger.setLevel(log_level)
    
    return logger

# Inicializar logger
logger = configure_logging()