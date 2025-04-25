import logging
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
from ..models.user import User, UserType
from ..models.transaction import Transaction, TransactionType
from ..services.auth_service import get_password_hash
import uuid
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def init_db():
    """
    Inicializa la base de datos con datos de prueba
    """
    from ..models import Base
    
    try:
        # Crear base de datos si no existe
        if not database_exists(engine.url):
            create_database(engine.url)
            logger.info(f"Base de datos creada: {engine.url}")
        
        # Crear tablas
        Base.metadata.create_all(bind=engine)
        logger.info("Tablas creadas correctamente")
        
        # Insertar datos de prueba
        with get_db() as db:
            # Verificar si ya existen datos
            if db.query(User).count() > 0:
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