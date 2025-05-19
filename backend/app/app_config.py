from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging

# Configuración básica para settings
class Settings:
    APP_NAME = "Aureum API"
    APP_VERSION = "1.0.0"
    DEBUG = True
    ALLOWED_ORIGINS = ["*"]  # En producción, limitar esto

# Crear instancia de settings
settings = Settings()

# Configurar logger
logger = logging.getLogger("aureum")

def create_app() -> FastAPI:
    """
    Crea y configura la aplicación FastAPI
    """
    # Crear aplicación
    app = FastAPI(
        title=settings.APP_NAME,
        description="API para la aplicación de gestión financiera Aureum",
        version=settings.APP_VERSION,
        docs_url="/api/docs" if settings.DEBUG else None,
        redoc_url="/api/redoc" if settings.DEBUG else None,
        debug=settings.DEBUG
    )
    
    # Agregar middleware CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Middleware de compresión
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # Middleware de hosts confiables
    if not settings.DEBUG:
        app.add_middleware(
            TrustedHostMiddleware, allowed_hosts=["localhost", "aureum.com"]
        )
    
    # Middleware personalizado para seguridad
    @app.middleware("http")
    async def security_middleware(request, call_next):
        # Log request info
        client_host = request.client.host if request.client else "unknown"
        logger.info(f"Request from {client_host}: {request.method} {request.url.path}")
        
        # Proceed with request
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        
        return response
    
    return app