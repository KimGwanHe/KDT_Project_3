from fastapi import FastAPI, HTTPException, Request, Depends, Header
from pydantic import BaseModel
from passlib.context import CryptContext
from pymongo import MongoClient
from pymongo.collection import Collection
from fastapi.middleware.cors import CORSMiddleware
import jwt
import datetime
from typing import Optional

# FastAPI 앱 초기화
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost", 
        "http://127.0.0.1",  
        "http://192.168.162.32:8081", 
        "exp://192.168.162.32:8081"  
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 비밀번호 해시와 JWT 토큰 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "abcd1234"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# MongoDB 설정
client = MongoClient("mongodb+srv://leesarah721:rXYZRi8SDYz7skmH@cluster0.s6fyzfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["3rd-project"]
collection: Collection = db["user"]

# Pydantic 모델
class User(BaseModel):
    nickname: str
    password: str

class LoginRequest(BaseModel):
    nickname: str
    password: str

class NicknameRequest(BaseModel):
    nickname: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Header(...)):
    try:
        if token.startswith("Bearer "):
            token = token[7:]  # "Bearer " 접두사 제거
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.get("/test-connection")
async def test_connection():
    try:
        client.admin.command('ping')
        return {"message": "MongoDB connection successful!"}
    except Exception as e:
        return {"message": "MongoDB connection failed!", "error": str(e)}
    
@app.post("/user/check-nickname")
async def check_nickname(nickname_request: NicknameRequest):
    # 요청 본문을 직접 받아서 처리
    print("Request data:", nickname_request.model_dump())
    nickname = nickname_request.nickname
    if not nickname:
        raise HTTPException(status_code=400, detail="Nickname is required.")
    existing_user = collection.find_one({"nickname": nickname})
    if existing_user:
        raise HTTPException(status_code=409, detail="중복 닉네임")
    return {"available": True, "message": "Nickname is available."}

@app.post("/user/register")
async def register(user: User):
    existing_user = collection.find_one({"nickname": user.nickname})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    collection.insert_one(user_dict)
    print(f"User registered: Nickname: {user.nickname}, Password (hashed): {hashed_password}")
    return {"message": "User registered successfully"}

@app.post("/user/login")
async def login(request: LoginRequest):
    user = collection.find_one({"nickname": request.nickname})
    if user and pwd_context.verify(request.password, user["password"]):
        access_token = create_access_token(data={"sub": request.nickname})
        print(f"User login: Nickname: {request.nickname}, Password (provided): {request.password}, Token: {access_token}")
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/user/logout")
async def logout():
    # 클라이언트 측에서 토큰을 삭제하도록 유도
    return {"message": "Logout successful. Please delete the token on the client side."}

@app.delete("/user/delete")
async def delete_account(request: Request):
    auth_header = request.headers.get('Authorization')
    if auth_header is None or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Token is required")
    token = auth_header[7:]  # Remove "Bearer " prefix
    username = get_current_user(token)
    result = collection.delete_one({"nickname": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Account deleted successfully"}

@app.post("/user/check-nickname")
async def check_nickname(nickname: str):
    existing_user = collection.find_one({"nickname": nickname})
    if existing_user:
        return {"available": False}
    return {"available": True}

# ==========================================================

live_streams = []

class LiveStream(BaseModel):
    nickname: str

@app.post("/start-live")
async def start_live(stream: LiveStream):
    # 이미 방송 중인 사용자인지 확인
    if any(s['nickname'] == stream.nickname for s in live_streams):
        raise HTTPException(status_code=400, detail="이미 방송 중입니다.")
    
    # 새로운 방송 추가
    live_streams.append(stream.model_dump())
    return {"message": f"{stream.nickname}님의 라이브 방송이 시작되었습니다."}

@app.post("/end-live")
async def end_live(stream: LiveStream):
    # 해당 방송을 종료 (리스트에서 삭제)
    global live_streams
    live_streams = [s for s in live_streams if s['nickname'] != stream.nickname]
    
    return {"message": f"{stream.nickname}님의 라이브 방송이 종료되었습니다."}

@app.get("/live-streams")
async def get_live_streams():
    # 현재 방송 중인 사용자 목록 반환
    return {"live_streams": live_streams}