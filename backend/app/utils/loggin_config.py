import logging
import sys
from pathlib import Path

def setup_logging():
    """
    Configura el sistema de logging para la aplicación
    """
    # Crear directorio de logs si no existe
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configurar formato
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"
    
    # Configurar logging
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        datefmt=date_format,
        handlers=[
            # Handler para archivo
            logging.FileHandler(log_dir / "app.log"),
            # Handler para consola
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Configurar niveles específicos
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    
    logger = logging.getLogger(__name__)
    logger.info("Sistema de logging configurado correctamente")

# Configurar logging al importar el módulo
setup_logging()
