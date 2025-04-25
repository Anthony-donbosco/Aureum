from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Optional
import re
import logging
import html

# Configuración de logging
logger = logging.getLogger(__name__)

# Configuración de seguridad
SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # En producción usar variables de entorno
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

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