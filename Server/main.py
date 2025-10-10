from fastapi import FastAPI
from vulcan import Keystore, Account, Vulcan
from contextlib import asynccontextmanager
from collections import defaultdict
from datetime import date, timedelta

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
app = FastAPI(lifespan=lifespan)

def convert_average_grade(avg):
    if 0 <= avg < 1.8:
        return 1
    elif 1.8 <= avg < 2.7:
        return 2
    elif 2.7 <= avg < 3.7:
        return 3
    elif 3.7 <= avg < 4.7:
        return 4
    elif 4.7 <= avg < 5.5:
        return 5
    elif 5.5 <= avg <= 6.0:
        return 6
    else:
        return "Nieprawidłowa wartość"

async def get_week_lessons(date_from, date_to):
        global client

        lessons = []
        changed_lessons = [
            {
                'id': lesson.id,
                'note': lesson.note,
                'name': "Odwołana" if not lesson.teacher else (lesson.subject.name if lesson.subject else "Zastępstwo"),
                'teacher': lesson.teacher.display_name if lesson.teacher else None
            }
            async for lesson in await client.data.get_changed_lessons(date_from=date_from, date_to=date_to)
        ]

        while date_from <= date_to:
            lessons.append(sorted(
                [
                    {
                        'position': lesson.time.position, 
                        'date': lesson.date.date, 
                        'time': lesson.time.displayed_time, 
                        'name': lesson.subject.name, 
                        'room': lesson.room.code, 
                        'teacher': lesson.teacher.display_name,
                        'changes_id': lesson.changes.id if lesson.changes else None
                    }
                async for lesson in await client.data.get_lessons(date_from=date_from)],
                key=lambda e: e['position']
            ))
            date_from += timedelta(days=1)

        changes_map = {change['id']: change for change in changed_lessons}

        for day in lessons:
            for lesson in day:
                if lesson['changes_id'] in changes_map:
                    change = changes_map[lesson['changes_id']]
                    lesson['name'] = change['name']
                    lesson['teacher'] = change['teacher']
                    lesson['note'] = change['note']

        return lessons

async def get_week_attendance(date_from, date_to):
    global client

    attendance_list = [
            {
                'position': attendance.time.position,
                'date': attendance.date.date,
                'time': attendance.time.displayed_time, 
                'name': attendance.subject.name if attendance.subject else None,
                'value': attendance.presence_type.name if attendance.presence_type else None
            }
            async for attendance in await client.data.get_attendance(date_from=date_from, date_to=date_to)
        ]

    grouped_data = defaultdict(list)
    for item in attendance_list:
        grouped_data[item["date"]].append(item)

    sorted_grouped_data = [
        sorted(items, key=lambda x: x["position"]) 
        for _, items in grouped_data.items()
    ]

    return sorted_grouped_data
    
@app.get("/api/get-grades")
async def get_grades():
    global client
    try:
        grades = []
        grade_dict = defaultdict(list)
        end_sum = 0

        async for grade in await client.data.get_grades():
            subject_name = grade.column.subject.name
            grade_value = grade.value
            grade_date = grade.date_created.date
            grade_name = grade.column.name if grade.column else "Brak"
            grade_weight = grade.column.weight
            category_name = grade.column.category.name if grade.column.category else "Brak"
            
            grade_dict[subject_name].append({
                "value": grade_value,
                "name": grade_name,
                "date": grade_date,
                "weight": grade_weight,
                "category": category_name
            })
        
        for subject_name, subject_grades in grade_dict.items():
            grades.append({
                "name": subject_name,
                "grades": subject_grades
            })

        for subject in grades:
            grade_sum = 0
            total_weight = 0
            
            for grade in subject['grades']:
                if grade['value']:
                    grade_sum += grade['value'] * grade['weight']
                    total_weight += grade['weight']
            
            avg = round(grade_sum / total_weight, 2)
            subject['averageGrade'] = avg
            subject['endGrade'] = convert_average_grade(avg)
            end_sum += convert_average_grade(avg)
        
        avg_grade = round(end_sum / len(grades), 2)
        return [grades, avg_grade]
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/api/get-lessons")
async def get_lessons(date_from: date, date_to: date):
    try:
        lessons = await get_week_lessons(date_from, date_to)
        return lessons
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/api/get-attendance")
async def get_attendance(date_from: date, date_to: date):
    try:
        attendance = await get_week_attendance(date_from, date_to)
        return attendance
    except Exception as e:
        return {"error": str(e)}