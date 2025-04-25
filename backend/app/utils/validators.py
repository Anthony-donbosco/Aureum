def validate_input(input_string: str) -> bool:
    """
    Valida una entrada para detectar posibles ataques XSS
    """
    if not isinstance(input_string, str):
        return True
    
    # Patrón para detectar posibles ataques XSS
    pattern = re.compile(r'[<>$\/=]')
    result = not bool(pattern.search(input_string))
    
    if not result:
        logger.warning(f"Detectado posible ataque XSS: {input_string}")
    
    return result

def sanitize_input(input_string: str) -> str:
    """
    Sanitiza una entrada para prevenir ataques XSS
    """
    if not isinstance(input_string, str):
        return input_string
    
    # Escapar caracteres HTML
    sanitized = html.escape(input_string)
    
    return sanitized

def validate_email(email: str) -> bool:
    """
    Valida un formato de email
    """
    # Primero verificar XSS
    if not validate_input(email):
        return False
    
    # Validar formato de email
    pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})')
    return bool(pattern.match(email))

def validate_password_strength(password: str) -> dict:
    """
    Valida la fortaleza de una contraseña
    """
    # Verificar XSS
    if not validate_input(password):
        return {
            "valid": False,
            "message": "No se permiten usar caracteres especiales"
        }
    
    # Verificar longitud
    if len(password) < 8:
        return {
            "valid": False,
            "message": "La contraseña debe tener al menos 8 caracteres"
        }
    
    # Verificar número
    if not any(char.isdigit() for char in password):
        return {
            "valid": False,
            "message": "La contraseña debe incluir al menos un número"
        }
    
    # Verificar mayúscula
    if not any(char.isupper() for char in password):
        return {
            "valid": False,
            "message": "La contraseña debe incluir al menos una letra mayúscula"
        }
    
    # Verificar minúscula
    if not any(char.islower() for char in password):
        return {
            "valid": False,
            "message": "La contraseña debe incluir al menos una letra minúscula"
        }
    
    # Verificar carácter especial
    if not any(char in "!@#$%^&*(),.?\":{}|<>" for char in password):
        return {
            "valid": False,
            "message": "La contraseña debe incluir al menos un carácter especial"
        }
    
    return {
        "valid": True,
        "message": "Contraseña fuerte"
    }