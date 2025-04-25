from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

import uuid
import jwt
import logging

from ..models.user import User, UserCreate, UserUpdate, UserInDB, ChangePassword, Token, TokenData
from ..services.auth_service import verify_password, get_password_hash, authenticate_user, create_access_token
from ..utils.security import get_current_user
from ..utils.validators import validate_input

# Configuración de logging
logger = logging.getLogger(__name__)

# Configuración del router
router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = None
    try:
        # Aquí iría el código para obtener la sesión de base de datos
        # Para este ejemplo, simularemos una DB en memoria
        db = {}
        yield db
    finally:
        if db:
            # Cerrar conexión si es necesario
            pass

# Configuración de seguridad
SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # En producción usar variables de entorno
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# Endpoint para login
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Endpoint para autenticación y obtención de token JWT
    """
    # Validación de seguridad para evitar ataques XSS
    if not validate_input(form_data.username) or not validate_input(form_data.password):
        logger.warning(f"Posible intento de XSS en login: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se permiten usar caracteres especiales",
        )
    
    # Autenticar usuario
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        logger.warning(f"Intento de login fallido para: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    logger.info(f"Login exitoso para: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint para registro
@router.post("/register", response_model=Token)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint para registro de nuevos usuarios
    """
    # Validar que no exista el email
    db_user = db.get(user_data.email, None)
    if db_user:
        logger.warning(f"Intento de registro con email ya existente: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado",
        )
    
    # Crear nuevo usuario
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    
    # Guardar en base de datos
    new_user = {
        "id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "hashed_password": hashed_password,
        "type": user_data.type,
        "birthdate": user_data.birthdate,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Simular guardado en base de datos
    db[user_data.email] = new_user
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data.email}, expires_delta=access_token_expires
    )
    
    logger.info(f"Nuevo usuario registrado: {user_data.email}")
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint para obtener usuario actual
@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Endpoint para obtener información del usuario actual
    """
    return current_user

# Endpoint para cambiar contraseña
@router.post("/change-password")
async def change_password(
    password_data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para cambiar la contraseña del usuario
    """
    # Obtener usuario de la base de datos
    user = db.get(current_user.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )
    
    # Verificar contraseña actual
    if not verify_password(password_data.old_password, user["hashed_password"]):
        logger.warning(f"Intento fallido de cambio de contraseña para: {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña actual incorrecta",
        )
    
    # Actualizar contraseña
    hashed_password = get_password_hash(password_data.new_password)
    user["hashed_password"] = hashed_password
    user["updated_at"] = datetime.utcnow()
    
    # Actualizar en base de datos
    db[current_user.email] = user
    
    logger.info(f"Contraseña cambiada para: {current_user.email}")
    return {"message": "Contraseña cambiada exitosamente"}

# Endpoint para actualizar perfil
@router.put("/profile", response_model=User)
async def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para actualizar el perfil del usuario
    """
    # Obtener usuario de la base de datos
    user = db.get(current_user.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )
    
    # Actualizar campos si fueron proporcionados
    if user_data.name:
        user["name"] = user_data.name
    
    if user_data.email and user_data.email != current_user.email:
        # Verificar que el nuevo email no exista
        if user_data.email in db:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está en uso",
            )
        
        # Cambiar la clave en el diccionario simulado
        old_email = current_user.email
        db[user_data.email] = user
        del db[old_email]
        user["email"] = user_data.email
    
    user["updated_at"] = datetime.utcnow()
    
    logger.info(f"Perfil actualizado para: {current_user.email}")
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "type": user["type"],
        "birthdate": user.get("birthdate")
    }