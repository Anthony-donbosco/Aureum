import time
from functools import wraps

def log_execution_time(func):
    """
    Decorador para registrar el tiempo de ejecución de una función
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        end_time = time.time()
        
        execution_time = end_time - start_time
        func_name = func.__name__
        logger.info(f"Función {func_name} ejecutada en {execution_time:.4f} segundos")
        
        return result
    
    return wrapper

def log_api_request(request, response_status):
    """
    Registra información sobre una solicitud API
    """
    client_host = request.client.host if request.client else "unknown"
    method = request.method
    url = str(request.url)
    user_agent = request.headers.get("user-agent", "unknown")
    
    logger.info(f"API Request: {method} {url} from {client_host} - Status: {response_status}")
    
    # Para depuración, registrar User-Agent
    logger.debug(f"User-Agent: {user_agent}")
    
    # Si es un error, registrar más detalles
    if response_status >= 400:
        logger.warning(f"API Error Response: {method} {url} - Status: {response_status}")
        # En producción, podríamos registrar más detalles como headers, etc.