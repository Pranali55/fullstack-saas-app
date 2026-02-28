from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from .database import SessionLocal
from . import models, schemas, auth

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed = auth.hash_password(user.password)
    new_user = models.User(username=user.username, password=hashed)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()

    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = auth.create_token({"sub": db_user.username})
    return {"access_token": token}

@router.get("/tasks")
def get_tasks(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_token(token)
    username = payload.get("sub")

    user = db.query(models.User).filter(models.User.username == username).first()
    return user.tasks

@router.post("/tasks")
def create_task(task: schemas.TaskCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_token(token)
    username = payload.get("sub")

    user = db.query(models.User).filter(models.User.username == username).first()

    new_task = models.Task(title=task.title, owner_id=user.id)
    db.add(new_task)
    db.commit()

    return {"message": "Task created"}

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_token(token)
    username = payload.get("sub")

    user = db.query(models.User).filter(models.User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.owner_id == user.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}