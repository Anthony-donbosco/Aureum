from datetime import datetime
import locale
from typing import Dict, List, Any

def format_date(date_str: str, input_format: str, output_format: str) -> str:
    """
    Convierte una fecha de un formato a otro
    """
    try:
        date_obj = datetime.strptime(date_str, input_format)
        return date_obj.strftime(output_format)
    except ValueError as e:
        logger.error(f"Error al formatear fecha: {str(e)}")
        return date_str

def parse_spanish_month(month_str: str) -> int:
    """
    Convierte un nombre de mes en español a su número correspondiente
    """
    month_map = {
        "ene": 1, "feb": 2, "mar": 3, "abr": 4, "may": 5, "jun": 6,
        "jul": 7, "ago": 8, "sep": 9, "oct": 10, "nov": 11, "dic": 12
    }
    
    month_str = month_str.lower()
    return month_map.get(month_str, 0)

def format_currency(amount: float) -> str:
    """
    Formatea un monto como moneda
    """
    return f"${amount:.2f}"

def format_percentage(value: float) -> str:
    """
    Formatea un valor como porcentaje
    """
    return f"{value:.1f}%"