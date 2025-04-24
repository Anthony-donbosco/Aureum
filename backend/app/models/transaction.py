class TransactionType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"

class Transaction(Base):
    """
    Modelo para representar una transacción financiera.
    """
    __tablename__ = "transactions"
    
    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    category = Column(String(50), nullable=False)
    subcategory = Column(String(50), nullable=True)
    amount = Column(Float, nullable=False)
    date = Column(String(10), nullable=False)  # Formato: DD MMM (ej: "15 mar")
    detail = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    user = relationship("User", back_populates="transactions")
    
    def __repr__(self):
        return f"<Transaction {self.id}: {self.type} - {self.category} - {self.amount}>"

# Modelos Pydantic para validación
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
import re

# Validadores
def validate_no_xss(value):
    """Validación para evitar caracteres que podrían ser usados en ataques XSS"""
    if not isinstance(value, str):
        return value
    
    # Patrón para detectar posibles intentos de XSS
    pattern = re.compile(r'[<>$\/=]')
    if pattern.search(value):
        raise ValueError("No se permiten usar caracteres especiales")
    
    return value

class UserBase(BaseModel):
    """Modelo base para usuarios"""
    name: str
    email: EmailStr
    
    @validator('name', 'email')
    def validate_inputs(cls, v):
        return validate_no_xss(v)

class UserCreate(UserBase):
    """Modelo para crear usuarios"""
    password: str
    birthdate: str
    type: str = "personal"
    
    @validator('password', 'birthdate', 'type')
    def validate_inputs(cls, v):
        return validate_no_xss(v)
    
    @validator('type')
    def validate_type(cls, v):
        if v not in ["personal", "business"]:
            raise ValueError("Tipo de usuario debe ser 'personal' o 'business'")
        return v
    
    @validator('birthdate')
    def validate_birthdate(cls, v):
        # Validar formato (DD/MM/YYYY)
        pattern = re.compile(r'^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4})
        if not pattern.match(v):
            raise ValueError("Formato de fecha incorrecto. Use DD/MM/YYYY")
        return v

class UserUpdate(BaseModel):
    """Modelo para actualizar usuarios"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    
    @validator('name', 'email')
    def validate_inputs(cls, v):
        if v is not None:
            return validate_no_xss(v)
        return v

class UserInDB(UserBase):
    """Modelo para usuarios en la base de datos"""
    id: str
    type: str
    birthdate: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class User(UserBase):
    """Modelo para respuesta de usuario"""
    id: str
    type: str
    birthdate: Optional[str] = None
    
    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    """Modelo base para transacciones"""
    type: str  # 'income' o 'expense'
    category: str
    subcategory: Optional[str] = None
    amount: float
    date: str
    detail: str
    
    @validator('type', 'category', 'subcategory', 'date', 'detail')
    def validate_inputs(cls, v):
        if v is not None:
            return validate_no_xss(v)
        return v
    
    @validator('type')
    def validate_type(cls, v):
        if v not in ["income", "expense"]:
            raise ValueError("Tipo de transacción debe ser 'income' o 'expense'")
        return v
    
    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("El monto debe ser mayor que cero")
        return v

class TransactionCreate(TransactionBase):
    """Modelo para crear transacciones"""
    pass

class TransactionUpdate(BaseModel):
    """Modelo para actualizar transacciones"""
    category: Optional[str] = None
    subcategory: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[str] = None
    detail: Optional[str] = None
    
    @validator('category', 'subcategory', 'date', 'detail')
    def validate_inputs(cls, v):
        if v is not None:
            return validate_no_xss(v)
        return v
    
    @validator('amount')
    def validate_amount(cls, v):
        if v is not None and v <= 0:
            raise ValueError("El monto debe ser mayor que cero")
        return v

class TransactionInDB(TransactionBase):
    """Modelo para transacciones en la base de datos"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class Transaction(TransactionBase):
    """Modelo para respuesta de transacción"""
    id: str
    
    class Config:
        orm_mode = True

class TransactionList(BaseModel):
    """Modelo para lista de transacciones"""
    transactions: List[Transaction]

class ChangePassword(BaseModel):
    """Modelo para cambio de contraseña"""
    old_password: str
    new_password: str
    
    @validator('old_password', 'new_password')
    def validate_passwords(cls, v):
        return validate_no_xss(v)
    
    @validator('new_password')
    def validate_password_strength(cls, v):
        # Validar longitud
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        
        # Validar que contenga al menos un número
        if not any(char.isdigit() for char in v):
            raise ValueError("La contraseña debe contener al menos un número")
        
        # Validar que contenga al menos una letra mayúscula
        if not any(char.isupper() for char in v):
            raise ValueError("La contraseña debe contener al menos una letra mayúscula")
        
        return v

class Token(BaseModel):
    """Modelo para token de autenticación"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Modelo para data del token"""
    username: Optional[str] = None

class Balance(BaseModel):
    """Modelo para balance financiero"""
    balance: float

class CategorySummary(BaseModel):
    """Modelo para resumen de categoría"""
    category: str
    amount: float
    percentage: float
    count: int

class MonthlyAnalysis(BaseModel):
    """Modelo para análisis mensual"""
    month: int
    year: int
    total_income: float
    total_expense: float
    balance: float
    top_expense_categories: List[CategorySummary]
    top_income_categories: List[CategorySummary]