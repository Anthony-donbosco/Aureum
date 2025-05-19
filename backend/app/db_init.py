import logging
import uuid
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import contextlib

# Importar modelos (corregir las rutas relativas)
from app.models.user import User, UserType
from app.models.transaction import Transaction, TransactionType
from app.services.auth_service import get_password_hash

# Configuración del logger
logger = logging.getLogger(__name__)

# Configuración de la base de datos
DATABASE_URL = "sqlite:///./aureum.db"
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Solo para SQLite
)

# Crear session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Función para obtener sesión de DB
@contextlib.contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Inicializa la base de datos con datos de prueba
    """
    # Importamos Base aquí para evitar dependencias circulares
    from app.models import Base
    
    try:
        # Crear tablas
        Base.metadata.create_all(bind=engine)
        logger.info("Tablas creadas correctamente")
        
        # Insertar datos de prueba
        with get_db() as db:
            # Verificar si ya existen datos
            user_count = db.query(User).count() if hasattr(db, 'query') else 0
            if user_count > 0:
                logger.info("La base de datos ya contiene datos, omitiendo la inicialización")
                return
            
            # Crear usuario de prueba
            test_user = User(
                id=str(uuid.uuid4()),
                name="Usuario de Prueba",
                email="test@example.com",
                hashed_password=get_password_hash("password123"),
                type=UserType.PERSONAL,
                birthdate="01/01/1990",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            
            # Crear transacciones de ejemplo
            now = datetime.utcnow()
            
            # Ingresos
            incomes = [
                Transaction(
                    id=str(uuid.uuid4()),
                    user_id=test_user.id,
                    type=TransactionType.INCOME,
                    category="Salario",
                    amount=1200.00,
                    date="10 abr",
                    detail="Salario mensual",
                    created_at=now - timedelta(days=20),
                    updated_at=now - timedelta(days=20)
                ),
                Transaction(
                    id=str(uuid.uuid4()),
                    user_id=test_user.id,
                    type=TransactionType.INCOME,
                    category="Venta",
                    amount=150.00,
                    date="15 abr",
                    detail="Venta de artículos usados",
                    created_at=now - timedelta(days=15),
                    updated_at=now - timedelta(days=15)
                )
            ]
            
            # Egresos
            expenses = [
                Transaction(
                    id=str(uuid.uuid4()),
                    user_id=test_user.id,
                    type=TransactionType.EXPENSE,
                    category="Supermercado",
                    amount=200.00,
                    date="12 abr",
                    detail="Compras semanales",
                    created_at=now - timedelta(days=18),
                    updated_at=now - timedelta(days=18)
                ),
                Transaction(
                    id=str(uuid.uuid4()),
                    user_id=test_user.id,
                    type=TransactionType.EXPENSE,
                    category="Servicio de Luz",
                    amount=50.00,
                    date="20 abr",
                    detail="Factura mensual",
                    created_at=now - timedelta(days=10),
                    updated_at=now - timedelta(days=10)
                ),
                Transaction(
                    id=str(uuid.uuid4()),
                    user_id=test_user.id,
                    type=TransactionType.EXPENSE,
                    category="Gastos Médicos",
                    amount=75.00,
                    date="22 abr",
                    detail="Consulta médica",
                    created_at=now - timedelta(days=8),
                    updated_at=now - timedelta(days=8)
                )
            ]
            
            db.add_all(incomes + expenses)
            db.commit()
            
            logger.info(f"Datos de prueba creados: Usuario {test_user.email} con {len(incomes)} ingresos y {len(expenses)} egresos")
    
    except Exception as e:
        logger.error(f"Error al inicializar la base de datos: {str(e)}")
        raise