interface Subject {
  name: string
  grades: {
    value: number | null
    name: string
    date: string
    weight: number
    category: string
  }[]
  averageGrade: number
  endGrade: number
}

interface Lesson {
  position: number
  date: string
  time: string
  name: string
  room: string
  teacher: string
  changes_id: number | null
  status?: string
  note?: string
}

interface AttendanceDay {
  position: number
  date: string
  time: string
  name: string | null
  value: string | null
}

interface AttendanceSummary {
  subject: string
  period_number: number
  attendance_percentage: number
  period_start: string
  period_end: string
  available_subjects?: string[]
}

interface Exam {
  type: string
  content: string
  subject: string
  deadline: string
}

interface Homework {
  content: string
  subject: string
  deadline: string
}

export type { Subject, Lesson, AttendanceDay, AttendanceSummary, Exam, Homework }
