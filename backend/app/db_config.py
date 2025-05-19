from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import contextlib
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde el directorio padre
import os
from pathlib import Path

# Obtener el directorio raíz del proyecto (backend/)
current_dir = Path(__file__).parent
backend_dir = current_dir.parent
env_path = backend_dir / '.env'

# Cargar variables de entorno
load_dotenv(env_path)

# Configuración de la base de datos
class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

settings = Settings()

# Configuración de la base de datos SQLAlchemy
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Crear engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

# Crear sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

# Función para obtener sesión de DB
@contextlib.contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()