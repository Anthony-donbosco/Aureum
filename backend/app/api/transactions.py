"""
Módulo para manejar las transacciones financieras en la API
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
import uuid
import logging

from ..models.transaction import Transaction, TransactionCreate, TransactionUpdate, TransactionList, Balance, CategorySummary, MonthlyAnalysis
from ..models.user import User
from ..utils.security import get_current_user
from ..utils.validators import validate_input

# Configuración de logging
logger = logging.getLogger(__name__)

# Configuración del router
router = APIRouter(
    prefix="/api/transactions",
    tags=["transactions"],
    responses={404: {"description": "Not found"}},
)

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = None
    try:
        # Aquí iría el código para obtener la sesión de base de datos
        # Para este ejemplo, simularemos una DB en memoria
        db = {"transactions": []}
        yield db
    finally:
        if db:
            # Cerrar conexión si es necesario
            pass

# Endpoint para crear una transacción
@router.post("", response_model=Transaction)
async def create_transaction(
    transaction: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para crear una nueva transacción
    """
    # Validación adicional de seguridad
    for field in [transaction.category, transaction.subcategory, transaction.date, transaction.detail]:
        if field and not validate_input(field):
            logger.warning(f"Posible intento de XSS en transacción para usuario: {current_user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se permiten usar caracteres especiales",
            )
    
    # Crear ID único para la transacción
    transaction_id = str(uuid.uuid4())
    
    # Preparar datos para guardar
    transaction_data = {
        "id": transaction_id,
        "user_id": current_user.id,
        "type": transaction.type,
        "category": transaction.category,
        "subcategory": transaction.subcategory,
        "amount": transaction.amount,
        "date": transaction.date,
        "detail": transaction.detail,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Guardar en base de datos simulada
    db["transactions"].append(transaction_data)
    
    logger.info(f"Nueva transacción creada: {transaction_id} por usuario: {current_user.email}")
    
    # Devolver datos de la transacción
    return {
        "id": transaction_id,
        "type": transaction.type,
        "category": transaction.category,
        "subcategory": transaction.subcategory,
        "amount": transaction.amount,
        "date": transaction.date,
        "detail": transaction.detail
    }

# Endpoint para obtener todas las transacciones
@router.get("", response_model=TransactionList)
async def get_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    type: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """
    Endpoint para obtener las transacciones del usuario con filtros opcionales
    """
    # Filtrar transacciones por usuario
    user_transactions = [tx for tx in db["transactions"] if tx["user_id"] == current_user.id]
    
    # Aplicar filtros adicionales si existen
    if type:
        user_transactions = [tx for tx in user_transactions if tx["type"] == type]
    
    if category:
        user_transactions = [tx for tx in user_transactions if tx["category"] == category]
    
    # Filtrar por rango de fechas si se proporcionan
    if start_date:
        user_transactions = [tx for tx in user_transactions if tx["date"] >= start_date]
    
    if end_date:
        user_transactions = [tx for tx in user_transactions if tx["date"] <= end_date]
    
    # Aplicar paginación
    paginated_transactions = user_transactions[skip:skip + limit]
    
    # Formatear resultados
    result = []
    for tx in paginated_transactions:
        result.append({
            "id": tx["id"],
            "type": tx["type"],
            "category": tx["category"],
            "subcategory": tx.get("subcategory"),
            "amount": tx["amount"],
            "date": tx["date"],
            "detail": tx["detail"]
        })
    
    return {"transactions": result}

# Endpoint para obtener ingresos
@router.get("/income", response_model=TransactionList)
async def get_income_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """
    Endpoint para obtener las transacciones de tipo ingreso
    """
    # Filtrar transacciones por usuario y tipo ingreso
    income_transactions = [
        tx for tx in db["transactions"]
        if tx["user_id"] == current_user.id and tx["type"] == "income"
    ]
    
    # Aplicar paginación
    paginated_transactions = income_transactions[skip:skip + limit]
    
    # Formatear resultados
    result = []
    for tx in paginated_transactions:
        result.append({
            "id": tx["id"],
            "type": tx["type"],
            "category": tx["category"],
            "subcategory": tx.get("subcategory"),
            "amount": tx["amount"],
            "date": tx["date"],
            "detail": tx["detail"]
        })
    
    return {"transactions": result}

# Endpoint para obtener egresos
@router.get("/expense", response_model=TransactionList)
async def get_expense_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """
    Endpoint para obtener las transacciones de tipo egreso
    """
    # Filtrar transacciones por usuario y tipo egreso
    expense_transactions = [
        tx for tx in db["transactions"]
        if tx["user_id"] == current_user.id and tx["type"] == "expense"
    ]
    
    # Aplicar paginación
    paginated_transactions = expense_transactions[skip:skip + limit]
    
    # Formatear resultados
    result = []
    for tx in paginated_transactions:
        result.append({
            "id": tx["id"],
            "type": tx["type"],
            "category": tx["category"],
            "subcategory": tx.get("subcategory"),
            "amount": tx["amount"],
            "date": tx["date"],
            "detail": tx["detail"]
        })
    
    return {"transactions": result}

# Endpoint para obtener una transacción específica
@router.get("/{transaction_id}", response_model=Transaction)
async def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para obtener una transacción específica
    """
    # Buscar la transacción
    transaction = next(
        (tx for tx in db["transactions"] if tx["id"] == transaction_id and tx["user_id"] == current_user.id),
        None
    )
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transacción no encontrada"
        )
    
    return {
        "id": transaction["id"],
        "type": transaction["type"],
        "category": transaction["category"],
        "subcategory": transaction.get("subcategory"),
        "amount": transaction["amount"],
        "date": transaction["date"],
        "detail": transaction["detail"]
    }

# Endpoint para actualizar una transacción
@router.put("/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: str,
    transaction_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para actualizar una transacción existente
    """
    # Validación de seguridad
    for field in [transaction_update.category, transaction_update.subcategory, 
                 transaction_update.date, transaction_update.detail]:
        if field and not validate_input(field):
            logger.warning(f"Posible intento de XSS en actualización de transacción para usuario: {current_user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se permiten usar caracteres especiales",
            )
    
    # Buscar la transacción
    transaction_index = None
    for i, tx in enumerate(db["transactions"]):
        if tx["id"] == transaction_id and tx["user_id"] == current_user.id:
            transaction_index = i
            break
    
    if transaction_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transacción no encontrada"
        )
    
    # Actualizar campos si fueron proporcionados
    transaction = db["transactions"][transaction_index]
    
    if transaction_update.category:
        transaction["category"] = transaction_update.category
    
    if transaction_update.subcategory:
        transaction["subcategory"] = transaction_update.subcategory
    
    if transaction_update.amount:
        transaction["amount"] = transaction_update.amount
    
    if transaction_update.date:
        transaction["date"] = transaction_update.date
    
    if transaction_update.detail:
        transaction["detail"] = transaction_update.detail
    
    transaction["updated_at"] = datetime.utcnow()
    
    # Actualizar en la lista
    db["transactions"][transaction_index] = transaction
    
    logger.info(f"Transacción actualizada: {transaction_id} por usuario: {current_user.email}")
    
    return {
        "id": transaction["id"],
        "type": transaction["type"],
        "category": transaction["category"],
        "subcategory": transaction.get("subcategory"),
        "amount": transaction["amount"],
        "date": transaction["date"],
        "detail": transaction["detail"]
    }

# Endpoint para eliminar una transacción
@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para eliminar una transacción
    """
    # Buscar la transacción
    transaction_index = None
    for i, tx in enumerate(db["transactions"]):
        if tx["id"] == transaction_id and tx["user_id"] == current_user.id:
            transaction_index = i
            break
    
    if transaction_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transacción no encontrada"
        )
    
    # Eliminar la transacción
    db["transactions"].pop(transaction_index)
    
    logger.info(f"Transacción eliminada: {transaction_id} por usuario: {current_user.email}")
    
    return {"message": "Transacción eliminada correctamente"}

# Endpoint para obtener el balance
@router.get("/balance", response_model=Balance)
async def get_balance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """
    Endpoint para obtener el balance financiero del usuario
    """
    # Obtener todas las transacciones del usuario
    user_transactions = [tx for tx in db["transactions"] if tx["user_id"] == current_user.id]
    
    # Aplicar filtros de fecha si se proporcionan
    if start_date:
        user_transactions = [tx for tx in user_transactions if tx["date"] >= start_date]
    
    if end_date:
        user_transactions = [tx for tx in user_transactions if tx["date"] <= end_date]
    
    # Calcular balance
    income_amount = sum(tx["amount"] for tx in user_transactions if tx["type"] == "income")
    expense_amount = sum(tx["amount"] for tx in user_transactions if tx["type"] == "expense")
    balance = income_amount - expense_amount
    
    return {
        "balance": balance,
        "total_income": income_amount,
        "total_expense": expense_amount,
        "start_date": start_date,
        "end_date": end_date
    }

# Endpoint para obtener análisis mensual
@router.get("/analysis/monthly", response_model=MonthlyAnalysis)
async def get_monthly_analysis(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2020, le=2100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para obtener análisis financiero mensual
    """
    # Obtener todas las transacciones del usuario
    user_transactions = [tx for tx in db["transactions"] if tx["user_id"] == current_user.id]
    
    # Filtrar por mes y año
    # Suponemos que la fecha está en formato "YYYY-MM-DD"
    start_date = f"{year}-{month:02d}-01"
    end_date = f"{year}-{month:02d}-31" if month != 2 else f"{year}-{month:02d}-{29 if year % 4 == 0 else 28}"
    filtered_transactions = [tx for tx in user_transactions if start_date <= tx["date"] <= end_date]
    
    # Separar ingresos y gastos
    income_transactions = [tx for tx in filtered_transactions if tx["type"] == "income"]
    expense_transactions = [tx for tx in filtered_transactions if tx["type"] == "expense"]
    
    # Calcular totales
    total_income = sum(tx["amount"] for tx in income_transactions)
    total_expense = sum(tx["amount"] for tx in expense_transactions)
    balance = total_income - total_expense
    
    # Agrupar por categoría
    income_by_category = {}
    for tx in income_transactions:
        category = tx["category"]
        if category not in income_by_category:
            income_by_category[category] = {"amount": 0, "count": 0}
        income_by_category[category]["amount"] += tx["amount"]
        income_by_category[category]["count"] += 1
    
    expense_by_category = {}
    for tx in expense_transactions:
        category = tx["category"]
        if category not in expense_by_category:
            expense_by_category[category] = {"amount": 0, "count": 0}
        expense_by_category[category]["amount"] += tx["amount"]
        expense_by_category[category]["count"] += 1
    
    # Calcular porcentajes
    top_income_categories = []
    for category, data in income_by_category.items():
        percentage = (data["amount"] / total_income) * 100 if total_income > 0 else 0
        top_income_categories.append({
            "category": category,
            "amount": data["amount"],
            "percentage": percentage,
            "count": data["count"]
        })
    
    top_expense_categories = []
    for category, data in expense_by_category.items():
        percentage = (data["amount"] / total_expense) * 100 if total_expense > 0 else 0
        top_expense_categories.append({
            "category": category,
            "amount": data["amount"],
            "percentage": percentage,
            "count": data["count"]
        })
    
    # Ordenar por monto (de mayor a menor)
    top_income_categories.sort(key=lambda x: x["amount"], reverse=True)
    top_expense_categories.sort(key=lambda x: x["amount"], reverse=True)
    
    return {
        "month": month,
        "year": year,
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "top_income_categories": top_income_categories,
        "top_expense_categories": top_expense_categories
    }

# Endpoint para obtener análisis por categoría
@router.get("/analysis/category", response_model=CategorySummary)
async def get_category_analysis(
    category: str = Query(...),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para obtener análisis detallado por categoría
    """
    # Obtener todas las transacciones del usuario
    user_transactions = [tx for tx in db["transactions"] if tx["user_id"] == current_user.id]
    
    # Filtrar por categoría
    category_transactions = [tx for tx in user_transactions if tx["category"] == category]
    
    # Aplicar filtros de fecha si se proporcionan
    if start_date:
        category_transactions = [tx for tx in category_transactions if tx["date"] >= start_date]
    
    if end_date:
        category_transactions = [tx for tx in category_transactions if tx["date"] <= end_date]
    
    # Calcular totales
    income_amount = sum(tx["amount"] for tx in category_transactions if tx["type"] == "income")
    expense_amount = sum(tx["amount"] for tx in category_transactions if tx["type"] == "expense")
    
    # Agrupar por subcategoría
    subcategory_summary = {}
    for tx in category_transactions:
        subcategory = tx.get("subcategory", "Sin subcategoría")
        if subcategory not in subcategory_summary:
            subcategory_summary[subcategory] = {
                "income": 0,
                "expense": 0,
                "count": 0
            }
        
        if tx["type"] == "income":
            subcategory_summary[subcategory]["income"] += tx["amount"]
        else:
            subcategory_summary[subcategory]["expense"] += tx["amount"]
        
        subcategory_summary[subcategory]["count"] += 1
    
    # Formatear resultados
    subcategories = []
    for subcategory, data in subcategory_summary.items():
        subcategories.append({
            "name": subcategory,
            "income": data["income"],
            "expense": data["expense"],
            "count": data["count"]
        })
    
    # Ordenar por monto total (income + expense)
    subcategories.sort(key=lambda x: x["income"] + x["expense"], reverse=True)
    
    return {
        "category": category,
        "total_income": income_amount,
        "total_expense": expense_amount,
        "transaction_count": len(category_transactions),
        "subcategories": subcategories,
        "start_date": start_date,
        "end_date": end_date
    }

# Endpoint para obtener estadísticas generales
@router.get("/stats/general")
async def get_general_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Endpoint para obtener estadísticas generales del usuario
    """
    # Obtener todas las transacciones del usuario
    user_transactions = [tx for tx in db["transactions"] if tx["user_id"] == current_user.id]
    
    # Datos básicos
    total_transactions = len(user_transactions)
    income_transactions = [tx for tx in user_transactions if tx["type"] == "income"]
    expense_transactions = [tx for tx in user_transactions if tx["type"] == "expense"]
    
    # Calcular estadísticas
    avg_income = sum(tx["amount"] for tx in income_transactions) / len(income_transactions) if income_transactions else 0
    avg_expense = sum(tx["amount"] for tx in expense_transactions) / len(expense_transactions) if expense_transactions else 0
    
    # Transacción más reciente
    latest_transaction = None
    if user_transactions:
        latest_transaction = max(user_transactions, key=lambda x: x["created_at"])
    
    # Categorías únicas
    unique_categories = set(tx["category"] for tx in user_transactions)
    
    return {
        "total_transactions": total_transactions,
        "income_count": len(income_transactions),
        "expense_count": len(expense_transactions),
        "avg_income": avg_income,
        "avg_expense": avg_expense,
        "unique_categories_count": len(unique_categories),
        "latest_transaction_date": latest_transaction["created_at"] if latest_transaction else None
    }

# Endpoint para búsqueda de transacciones
@router.get("/search", response_model=TransactionList)
async def search_transactions(
    query: str = Query(..., min_length=3),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50)
):
    """
    Endpoint para buscar transacciones por texto
    """
    # Obtener todas las transacciones del usuario
    user_transactions = [tx for tx in db["transactions"] if tx["user_id"] == current_user.id]
    
    # Buscar en campos relevantes
    query = query.lower()
    search_results = []
    
    for tx in user_transactions:
        # Buscar en categoría, subcategoría y detalle
        if (
            (tx["category"] and query in tx["category"].lower()) or
            (tx.get("subcategory") and query in tx["subcategory"].lower()) or
            (tx["detail"] and query in tx["detail"].lower())
        ):
            search_results.append(tx)
    
    # Aplicar paginación
    paginated_results = search_results[skip:skip + limit]
    
    # Formatear resultados
    result = []
    for tx in paginated_results:
        result.append({
            "id": tx["id"],
            "type": tx["type"],
            "category": tx["category"],
            "subcategory": tx.get("subcategory"),
            "amount": tx["amount"],
            "date": tx["date"],
            "detail": tx["detail"]
        })
    
    return {"transactions": result}