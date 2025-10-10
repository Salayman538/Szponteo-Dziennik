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
  note?: string
}

interface AttendanceDay {
  position: number
  date: string
  time: string
  name: string | null
  value: string | null
}

export type { Subject, Lesson, AttendanceDay }
