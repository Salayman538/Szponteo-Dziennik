from datetime import date, datetime
from vulcan import Vulcan
from typing import List, Dict, Any, Tuple
import unicodedata

TARGET_PERIOD_NUMBER: int = 1 

PRESENCE_TYPES_PRESENT = ['obecność', 'spóźnienie', 'spóźn. uspr.']
PRESENCE_TYPES_IGNORED = ['zwolnienie', 'BRAK_TYPU']

def normalize_string(s: str) -> str:
    """Normalizuje Unicode, usuwa spacje i zamienia na małe litery"""
    if not s:
        return ''
    return unicodedata.normalize('NFC', s).strip().lower()

def _calculate_attendance(attendance_records: List[Dict[str, Any]], subject_name: str) -> float:
    attended_lessons = 0
    total_lessons = 0
    subject_name_norm = normalize_string(subject_name)

    for record in attendance_records:
        subj = normalize_string(record.get('subject_name', ''))
        presence = normalize_string(record.get('presence_type', ''))

        if subject_name_norm != "all" and subject_name_norm not in subj:
            continue
        if presence in [normalize_string(p) for p in PRESENCE_TYPES_IGNORED]:
            continue
        total_lessons += 1
        if presence in [normalize_string(p) for p in PRESENCE_TYPES_PRESENT]:
            attended_lessons += 1

    if total_lessons == 0:
        return 0.0
    
    return round((attended_lessons / total_lessons) * 100, 2)


def to_python_date(d) -> date:
    if isinstance(d, date) and not isinstance(d, datetime):
        return d
    if isinstance(d, datetime):
        return d.date()
    if isinstance(d, datetime):
        return d.date()
    
    if hasattr(d, 'date'):
        date_attr = getattr(d, 'date')
        
        if callable(date_attr):
            val = date_attr()
        else:
            val = date_attr
            
        if isinstance(val, date):
            return val

async def fetch_attendance_data(client: Vulcan, period_number: int) -> Tuple[List[Dict[str, Any]], date, date]:

    student_list = await client.get_students()
    if not student_list:
        raise Exception("Lista studentów jest pusta po uwierzytelnieniu.")
    
    student = student_list[0]

    if not hasattr(student, 'periods') or not student.periods:
        raise Exception("Brak okresów klasyfikacyjnych dla ucznia.")
    
    target_period = next((p for p in student.periods if p.number == period_number), None)
    if target_period is None:
        raise Exception(f"Brak okresu klasyfikacyjnego numer {period_number}.")

    date_from_obj = to_python_date(target_period.start)
    date_to_obj = to_python_date(target_period.end)

    attendance_stream = await client.data.get_attendance(
        date_from=date_from_obj,
        date_to=date_to_obj
    )

    raw_records: List[Dict[str, Any]] = []

    async for record in attendance_stream:
        presence_type_name = record.presence_type.name if hasattr(record, 'presence_type') and record.presence_type else 'BRAK_TYPU'
        subject_name = record.subject.name if hasattr(record, 'subject') and record.subject and hasattr(record.subject, 'name') else 'Nieznany'

        record_date = to_python_date(record.date) 

        raw_records.append({
            'presence_type': presence_type_name,
            'subject_name': subject_name,
            'date': record_date.isoformat()
        })

    return raw_records, date_from_obj, date_to_obj