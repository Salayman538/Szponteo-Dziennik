from fastapi import FastAPI
from vulcan import Keystore, Account, Vulcan
from contextlib import asynccontextmanager
from datetime import date
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from attendance_calculator import fetch_attendance_data, _calculate_attendance, TARGET_PERIOD_NUMBER
from controllers import get_week_attendance, get_week_lessons, get_student_grades

# dev
# uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Globalna zmienna do przechowywania klienta Vulcan
client = None

# Context manager do zarządzania cyklem życia aplikacji
@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    
    with open("keys/keystore.json") as f:
        keystore = Keystore.load(f)

    with open("keys/account.json") as f:
        account = Account.load(f)
    
    client = Vulcan(keystore, account)
    await client.select_student()
    
    yield
    
    # Kod wykonywany podczas zamykania aplikacji
    if client:
        await client.close()

# Inicjalizacja aplikacji z context managerem
from fastapi.middleware.cors import CORSMiddleware

# ... (app initialization)
app = FastAPI(lifespan=lifespan)

# Define allowed origins
# For development, you can use ["*"] to allow everything, 
# but it's better to list your specific frontend URLs
origins = [
    "http://localhost:3000",      # Common React/Next.js port
    "http://127.0.0.1:3000",
    "http://192.168.1.39:3000",   # If accessing from another device
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Use origins list instead of ["*"] for better security
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)
    
# OCENY

@app.get("/api/get-grades")
async def get_grades():
    try:
        grades = await get_student_grades(client)
        return grades
    except Exception as e:
        return {"get-grades error": str(e)}

# Plan lekcji

@app.get("/api/get-lessons")
async def get_lessons(date_from: date, date_to: date):
    try:
        lessons = await get_week_lessons(client, date_from, date_to)
        return lessons
    except Exception as e:
        return {"get-lessons error": str(e)}

# Frekwencja

@app.get("/api/get-attendance")
async def get_attendance(date_from: date, date_to: date):
    try:
        attendance = await get_week_attendance(client, date_from, date_to)
        return attendance
    except Exception as e:
        return {"get-attendance error": str(e)}
    
class AttendanceResponse(BaseModel):
    subject: str
    period_number: int
    attendance_percentage: float
    period_start: str
    period_end: str
    available_subjects: list[str]

# Statystyki do frekwencji

@app.get("/api/get-attendance/summary", response_model=AttendanceResponse)
async def get_semester_attendance(subject: str = "all"):
    global client

    try:
        raw_records, date_from, date_to = await fetch_attendance_data(client, TARGET_PERIOD_NUMBER)

        available_subjects = sorted({r.get('subject_name','Nieznany') for r in raw_records})

        subject_norm = subject.lower()
        if subject_norm != "all":
            filtered_records = [r for r in raw_records if r.get("subject_name","").lower() == subject_norm]
        else:
            filtered_records = raw_records

        percentage = await run_in_threadpool(_calculate_attendance, filtered_records, subject_norm)

        display_subject = subject
        if display_subject.lower() == "all":
            display_subject = "Frekwencja ogólna"

        return AttendanceResponse(
            subject=display_subject,
            period_number=TARGET_PERIOD_NUMBER,
            attendance_percentage=percentage,
            period_start=date_from.isoformat(),
            period_end=date_to.isoformat(),
            available_subjects=available_subjects
        )

    except Exception as e:
        return {"get-attendance/summary error": str(e)}

@app.get("/api/get-homework")
async def get_homework():
    homework_list = [
        {
            'content': homework.content,
            'subject': homework.subject.name,
            'deadline': homework.deadline.date
        }
        async for homework in await client.data.get_homework()
    ]
    homework_list.sort(key=lambda x: x["deadline"])

    return homework_list

@app.get("/api/get-exams")
async def get_exams():
    exams_list = [
        {
            'type': exam.type,
            'content': exam.topic,
            'subject': exam.subject.name,
            'deadline': exam.deadline.date

        }
        async for exam in await client.data.get_exams()
    ]
    exams_list.sort(key=lambda x: x["deadline"])

    return exams_list