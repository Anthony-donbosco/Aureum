from datetime import datetime, timedelta
from typing import Optional
import jwt
import re
import hashlib
import secrets
import logging

from ..models.user import User, UserInDB

# Configuración de logging
logger = logging.getLogger(__name__)

# Configuración de seguridad
SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # En producción usar variables de entorno
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

# Funciones para el manejo de contraseñas
def get_password_hash(password: str) -> str:
    """
    Crea un hash seguro para la contraseña
    """
    salt = secrets.token_hex(16)
    hash_obj = hashlib.sha256(f"{password}{salt}".encode())
    return f"{hash_obj.hexdigest()}:{salt}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si la contraseña plana coincide con el hash almacenado
    """
    if ":" not in hashed_password:
        return False
    
    hash_val, salt = hashed_password.split(":")
    hash_obj = hashlib.sha256(f"{plain_password}{salt}".encode())
    return hash_obj.hexdigest() == hash_val

def authenticate_user(db, email: str, password: str) -> Optional[User]:
    """
    Autentica un usuario por email y contraseña
    """
    # En un caso real, buscaríamos en la base de datos
    # Para este ejemplo, simulamos con un diccionario
    user = db.get(email)
    if not user:
        logger.warning(f"Intento de autenticación con email no existente: {email}")
        return None
    
    if not verify_password(password, user["hashed_password"]):
        logger.warning(f"Contraseña incorrecta para usuario: {email}")
        return None
    
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "type": user["type"],
        "birthdate": user.get("birthdate")
    }

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token JWT de acceso
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt