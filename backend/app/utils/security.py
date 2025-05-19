from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Optional
import re
import logging
import html
import hashlib
import secrets

# Configuración de logging
logger = logging.getLogger(__name__)

# Configuración de seguridad
SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # En producción usar variables de entorno
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# Funciones para manejo de contraseñas
def hash_password(password: str) -> str:
    """
    Create salted password hash using SHA-256
    """
    try:
        salt = secrets.token_hex(16)
        hash_obj = hashlib.sha256(f"{password}{salt}".encode())
        hashed_password = f"{hash_obj.hexdigest()}:{salt}"
        logger.debug("Password hashed successfully")
        return hashed_password
    except Exception as e:
        logger.error(f"Error hashing password: {str(e)}")
        raise

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against stored hash
    """
    try:
        if ":" not in hashed_password:
            logger.warning("Invalid hashed password format")
            return False
        
        hash_val, salt = hashed_password.split(":", 1)
        hash_obj = hashlib.sha256(f"{plain_password}{salt}".encode())
        is_valid = hash_obj.hexdigest() == hash_val
        
        if is_valid:
            logger.debug("Password verification successful")
        else:
            logger.warning("Password verification failed")
            
        return is_valid
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False

def generate_secure_token(length: int = 32) -> str:
    """
    Generate a secure random token
    """
    try:
        token = secrets.token_urlsafe(length)
        logger.debug(f"Secure token generated with length {length}")
        return token
    except Exception as e:
        logger.error(f"Error generating secure token: {str(e)}")
        raise

# Función para verificar token y obtener usuario actual
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Obtiene el usuario actual a partir del token JWT
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decodificar el token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            logger.warning("Token JWT sin campo 'sub'")
            raise credentials_exception
    except JWTError as e:
        logger.warning(f"Error al decodificar token JWT: {str(e)}")
        raise credentials_exception
    
    # En un caso real, buscaríamos el usuario en la base de datos
    # Para este ejemplo, simulamos un usuario
    user = {
        "id": "user-123",
        "name": "Usuario de Prueba",
        "email": email,
        "type": "personal"
    }
    
    if user is None:
        logger.warning(f"Usuario no encontrado para email: {email}")
        raise credentials_exception
    
    return user