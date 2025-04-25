"""
Módulo para manejar los usuarios en la API
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
import uuid

from ..models.user import User, UserUpdate
from ..utils.security import get_current_user
from ..utils.validators import validate_input

# Configuración de logging
logger = logging.getLogger(__name__)

# Configuración del router
router = APIRouter(
    prefix="/api/users",
    tags=["users"],
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

# Endpoint para obtener perfil de usuario
@router.get("/me", response_model=User)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Endpoint para obtener el perfil del usuario actual
    """
    return current_user

# Endpoint para actualizar perfil de usuario
@router.put("/me", response_model=User)
async def update_user_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para actualizar el perfil del usuario actual
    """
    # Validación de seguridad
    if user_data.name and not validate_input(user_data.name):
        logger.warning(f"Posible intento de XSS en actualización de perfil para usuario: {current_user.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se permiten usar caracteres especiales en el nombre",
        )
    
    # En un caso real, buscaríamos el usuario en la base de datos y lo actualizaríamos
    # Para este ejemplo, simulamos actualizar el usuario
    updated_user = {
        "id": current_user["id"],
        "name": user_data.name if user_data.name else current_user["name"],
        "email": current_user["email"],  # No permitimos cambiar el email en este endpoint
        "type": current_user["type"]
    }
    
    logger.info(f"Perfil actualizado para usuario: {current_user['email']}")
    
    return updated_user

# Endpoint para cambiar correo electrónico
@router.put("/me/email")
async def change_email(
    email: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para cambiar el correo electrónico del usuario
    """
    # Validación de seguridad
    if not validate_input(email):
        logger.warning(f"Posible intento de XSS en cambio de email para usuario: {current_user['email']}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se permiten usar caracteres especiales en el email",
        )
    
    # Verificar que el nuevo email no esté ya registrado
    # En un caso real, buscaríamos en la base de datos
    if email in db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado",
        )
    
    # En un caso real, actualizaríamos el email en la base de datos
    
    logger.info(f"Email cambiado para usuario: {current_user['email']} -> {email}")
    
    return {"message": "Email actualizado correctamente"}

# Endpoint para eliminar cuenta
@router.delete("/me")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para eliminar la cuenta del usuario
    """
    # En un caso real, marcaríamos el usuario como eliminado en la base de datos
    # o lo eliminaríamos físicamente según la política de la aplicación
    
    logger.info(f"Cuenta eliminada para usuario: {current_user['email']}")
    
    return {"message": "Cuenta eliminada correctamente"}

# Endpoint para obtener estadísticas del usuario
@router.get("/me/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para obtener estadísticas financieras del usuario
    """
    # En un caso real, calcularíamos estadísticas basadas en las transacciones
    # Para este ejemplo, devolvemos estadísticas simuladas
    
    stats = {
        "total_income": 2300.00,
        "total_expense": 1350.00,
        "balance": 950.00,
        "transactions_count": 8,
        "top_income_category": "Salario",
        "top_expense_category": "Supermercado",
        "monthly_average_income": 1150.00,
        "monthly_average_expense": 675.00,
        "savings_rate": 41.3  # Porcentaje
    }
    
    return stats

# Endpoint para verificar disponibilidad de email
@router.get("/email-available")
async def check_email_available(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Endpoint para verificar si un email está disponible para registro
    """
    # Validación de seguridad
    if not validate_input(email):
        logger.warning(f"Posible intento de XSS en verificación de email: {email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se permiten usar caracteres especiales en el email",
        )
    
    # En un caso real, verificaríamos si el email existe en la base de datos
    # Para este ejemplo, simulamos la verificación
    exists = email in db
    
    return {"available": not exists}

# Endpoint para obtener preferencias del usuario
@router.get("/me/preferences")
async def get_user_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para obtener las preferencias del usuario
    """
    # En un caso real, obtendríamos las preferencias de la base de datos
    # Para este ejemplo, devolvemos preferencias simuladas
    
    preferences = {
        "theme": "light",
        "language": "es",
        "currency": "USD",
        "notifications_enabled": True,
        "email_notifications": True,
        "dashboard_widgets": ["balance", "recent_transactions", "expenses_chart"]
    }
    
    return preferences

# Endpoint para actualizar preferencias del usuario
@router.put("/me/preferences")
async def update_user_preferences(
    preferences: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para actualizar las preferencias del usuario
    """
    # En un caso real, actualizaríamos las preferencias en la base de datos
    # Para este ejemplo, simulamos la actualización
    
    logger.info(f"Preferencias actualizadas para usuario: {current_user['email']}")
    
    return {"message": "Preferencias actualizadas correctamente"}

# Endpoint para verificar seguridad de contraseña
@router.post("/password-strength")
async def check_password_strength(password: str):
    """
    Endpoint para verificar la fortaleza de una contraseña
    """
    # Validación de seguridad
    if not validate_input(password):
        return {
            "score": 0,
            "strength": "insegura",
            "message": "No se permiten usar caracteres especiales",
            "suggestions": ["Evite caracteres especiales como < > $ / ="]
        }
    
    # Criterios de fortaleza
    criteria = {
        "length": len(password) >= 8,
        "uppercase": any(c.isupper() for c in password),
        "lowercase": any(c.islower() for c in password),
        "digits": any(c.isdigit() for c in password),
        "special": any(c in "!@#$%^&*(),.?\":{}|<>" for c in password)
    }
    
    # Calcular puntuación (1-5)
    score = sum(1 for passed in criteria.values() if passed)
    
    # Determinar nivel de fortaleza
    strength = "muy débil"
    if score == 5:
        strength = "muy fuerte"
    elif score == 4:
        strength = "fuerte"
    elif score == 3:
        strength = "media"
    elif score == 2:
        strength = "débil"
    
    # Sugerencias para mejorar
    suggestions = []
    if not criteria["length"]:
        suggestions.append("Use al menos 8 caracteres")
    if not criteria["uppercase"]:
        suggestions.append("Incluya al menos una letra mayúscula")
    if not criteria["lowercase"]:
        suggestions.append("Incluya al menos una letra minúscula")
    if not criteria["digits"]:
        suggestions.append("Incluya al menos un número")
    if not criteria["special"]:
        suggestions.append("Incluya al menos un carácter especial (ej. !@#$%)")
    
    return {
        "score": score,
        "strength": strength,
        "criteria": criteria,
        "suggestions": suggestions
    }
