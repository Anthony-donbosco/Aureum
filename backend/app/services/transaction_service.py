from typing import List, Dict, Any
from datetime import datetime

def calculate_balance(transactions: List[Dict[str, Any]]) -> float:
    """
    Calcula el balance financiero basado en ingresos y egresos
    """
    income_amount = sum(tx["amount"] for tx in transactions if tx["type"] == "income")
    expense_amount = sum(tx["amount"] for tx in transactions if tx["type"] == "expense")
    
    return income_amount - expense_amount

def get_monthly_transactions(transactions: List[Dict[str, Any]], month: int, year: int) -> List[Dict[str, Any]]:
    """
    Filtra las transacciones por mes y año
    """
    # Nota: En un caso real, se necesitaría parsear la fecha correctamente
    # Para este ejemplo, asumimos que todas las transacciones son del mes y año dados
    return transactions

def get_category_summary(transactions: List[Dict[str, Any]], transaction_type: str) -> List[Dict[str, Any]]:
    """
    Agrupa las transacciones por categoría y calcula estadísticas
    """
    filtered_transactions = [tx for tx in transactions if tx["type"] == transaction_type]
    total_amount = sum(tx["amount"] for tx in filtered_transactions)
    
    # Agrupar por categoría
    categories = {}
    for tx in filtered_transactions:
        category = tx["category"]
        if category not in categories:
            categories[category] = {"amount": 0, "count": 0}
        
        categories[category]["amount"] += tx["amount"]
        categories[category]["count"] += 1
    
    # Calcular porcentajes y preparar resultado
    result = []
    for category, data in categories.items():
        percentage = (data["amount"] / total_amount) * 100 if total_amount > 0 else 0
        result.append({
            "category": category,
            "amount": data["amount"],
            "percentage": percentage,
            "count": data["count"]
        })
    
    # Ordenar por monto (de mayor a menor)
    result.sort(key=lambda x: x["amount"], reverse=True)
    
    return result

def get_transaction_trends(transactions: List[Dict[str, Any]], months: int = 6) -> Dict[str, Any]:
    """
    Calcula tendencias de ingresos y egresos para los últimos N meses
    """
    # Nota: En un caso real, se agruparían las transacciones por mes
    # Para este ejemplo, se devuelve un resultado simulado
    
    return {
        "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "income": [1000, 1200, 900, 1500, 1300, 1100],
        "expense": [800, 900, 850, 950, 1000, 900]
    }

def validate_transaction_data(transaction_data: Dict[str, Any]) -> Dict[str, str]:
    """
    Valida los datos de una transacción
    """
    errors = {}
    
    # Validar tipo
    if "type" not in transaction_data or transaction_data["type"] not in ["income", "expense"]:
        errors["type"] = "Tipo de transacción inválido. Debe ser 'income' o 'expense'"
    
    # Validar categoría
    if "category" not in transaction_data or not transaction_data["category"].strip():
        errors["category"] = "La categoría es obligatoria"
    
    # Validar monto
    if "amount" not in transaction_data:
        errors["amount"] = "El monto es obligatorio"
    elif not isinstance(transaction_data["amount"], (int, float)) or transaction_data["amount"] <= 0:
        errors["amount"] = "El monto debe ser un número mayor que cero"
    
    # Validar fecha
    if "date" not in transaction_data or not transaction_data["date"].strip():
        errors["date"] = "La fecha es obligatoria"
    
    # Validar detalle
    if "detail" not in transaction_data or not transaction_data["detail"].strip():
        errors["detail"] = "El detalle es obligatorio"
    
    return errors