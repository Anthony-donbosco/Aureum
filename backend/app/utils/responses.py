from typing import Any
from fastapi.responses import JSONResponse
from fastapi import status

def create_error_response(status_code: int, message: str, details: Any = None) -> JSONResponse:
    """
    Crea una respuesta de error para la API
    """
    content = {
        "status": "error",
        "message": message,
    }
    
    if details:
        content["details"] = details
    
    return JSONResponse(
        status_code=status_code,
        content=content
    )

def create_success_response(data: Any = None, message: str = "Operación exitosa") -> JSONResponse:
    """
    Crea una respuesta de éxito para la API
    """
    content = {
        "status": "success",
        "message": message,
    }
    
    if data is not None:
        content["data"] = data
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=content
    )
