from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List
from datetime import datetime, timedelta
import jwt
import re
import hashlib
import secrets
import html
import logging
from logging.handlers import RotatingFileHandler

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler("aureum_api.log", maxBytes=10485760, backupCount=5),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("aureum_api")

# Initialize FastAPI
app = FastAPI(title="Aureum API", description="Backend for Aureum financial app", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security configuration
SECRET_KEY = "YOUR_SECRET_KEY"  # In production, use environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database models (using in-memory data for demo)
users_db = {}
transactions_db = []
current_id = 0

# Security helper functions
def validate_input(input_string: str) -> bool:
    """Check for potential XSS attack patterns"""
    xss_pattern = re.compile(r'[<>$\/=]')
    return not bool(xss_pattern.search(input_string))

def sanitize_input(input_string: str) -> str:
    """Sanitize input to prevent XSS"""
    return html.escape(input_string)

def hash_password(password: str) -> str:
    """Create salted password hash"""
    salt = secrets.token_hex(16)
    hash_obj = hashlib.sha256(f"{password}{salt}".encode())
    return f"{hash_obj.hexdigest()}:{salt}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against stored hash"""
    if ":" not in hashed_password:
        return False
    
    hash_val, salt = hashed_password.split(":")
    hash_obj = hashlib.sha256(f"{plain_password}{salt}".encode())
    return hash_obj.hexdigest() == hash_val

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = users_db.get(username)
    if user is None:
        raise credentials_exception
        
    return user

# Security middleware
@app.middleware("http")
async def security_middleware(request: Request, call_next):
    """Middleware for security checks"""
    # Log request info for security monitoring
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

# Pydantic models
class UserBase(BaseModel):
    email: EmailStr
    name: str
    
    @validator('email', 'name')
    def validate_inputs(cls, v):
        if not validate_input(v):
            raise ValueError("No se permiten usar caracteres especiales")
        return v

class UserCreate(UserBase):
    password: str
    birthdate: str
    type: str = "personal"
    
    @validator('password', 'birthdate', 'type')
    def validate_inputs(cls, v):
        if not validate_input(v):
            raise ValueError("No se permiten usar caracteres especiales")
        return v

class User(UserBase):
    id: str
    type: str

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TransactionBase(BaseModel):
    type: str  # 'income' or 'expense'
    category: str
    amount: float
    detail: str
    date: str
    
    @validator('type', 'category', 'detail', 'date')
    def validate_inputs(cls, v):
        if not validate_input(v):
            raise ValueError("No se permiten usar caracteres especiales")
        return v
    
    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("La cantidad debe ser mayor que cero")
        return v

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    user_id: str
    created_at: datetime

# API routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """User login endpoint"""
    # Validate inputs
    if not validate_input(form_data.username) or not validate_input(form_data.password):
        logger.warning(f"Possible XSS attempt in login: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se permiten usar caracteres especiales",
        )
    
    # Check user
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Failed login attempt for user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    logger.info(f"Successful login for user: {form_data.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=Token)
async def register_user(user_data: UserCreate):
    """User registration endpoint"""
    # Check if email already exists
    if user_data.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create user
    global current_id
    current_id += 1
    user_id = f"user-{current_id}"
    
    # Hash the password
    hashed_password = hash_password(user_data.password)
    
    # Create user in DB
    user = UserInDB(
        id=user_id,
        email=sanitize_input(user_data.email),
        name=sanitize_input(user_data.name),
        type=sanitize_input(user_data.type),
        hashed_password=hashed_password
    )
    
    users_db[user_data.email] = user
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    logger.info(f"New user registered: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@app.post("/transactions", response_model=Transaction)
async def create_transaction(
    transaction: TransactionCreate, 
    current_user: UserInDB = Depends(get_current_user)
):
    """Create a new transaction"""
    global current_id
    current_id += 1
    
    # Sanitize inputs
    sanitized_transaction = TransactionCreate(
        type=sanitize_input(transaction.type),
        category=sanitize_input(transaction.category),
        amount=transaction.amount,
        detail=sanitize_input(transaction.detail),
        date=sanitize_input(transaction.date)
    )
    
    # Create transaction in DB
    transaction_id = f"tx-{current_id}"
    transaction_obj = Transaction(
        id=transaction_id,
        user_id=current_user.id,
        created_at=datetime.now(),
        **sanitized_transaction.dict()
    )
    
    transactions_db.append(transaction_obj)
    
    logger.info(f"New transaction created: {transaction_id} for user {current_user.id}")
    return transaction_obj

@app.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: UserInDB = Depends(get_current_user)):
    """Get all transactions for the current user"""
    user_transactions = [tx for tx in transactions_db if tx.user_id == current_user.id]
    return user_transactions

@app.get("/transactions/income", response_model=List[Transaction])
async def get_income_transactions(current_user: UserInDB = Depends(get_current_user)):
    """Get income transactions for the current user"""
    user_transactions = [
        tx for tx in transactions_db 
        if tx.user_id == current_user.id and tx.type == "income"
    ]
    return user_transactions

@app.get("/transactions/expense", response_model=List[Transaction])
async def get_expense_transactions(current_user: UserInDB = Depends(get_current_user)):
    """Get expense transactions for the current user"""
    user_transactions = [
        tx for tx in transactions_db 
        if tx.user_id == current_user.id and tx.type == "expense"
    ]
    return user_transactions

@app.get("/balance")
async def get_balance(current_user: UserInDB = Depends(get_current_user)):
    """Get balance for the current user"""
    user_transactions = [tx for tx in transactions_db if tx.user_id == current_user.id]
    
    balance = 0
    for tx in user_transactions:
        if tx.type == "income":
            balance += tx.amount
        else:
            balance -= tx.amount
    
    return {"balance": balance}

# Main function
if __name__ == "__main__":
    import uvicorn
    
    # Add a default user for testing
    default_user = UserInDB(
        id="user-0",
        email="test@example.com",
        name="Test User",
        type="personal",
        hashed_password=hash_password("password123")
    )
    users_db[default_user.email] = default_user
    
    # Start server
    uvicorn.run(app, host="0.0.0.0", port=8000)