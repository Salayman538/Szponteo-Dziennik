import React, { useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

// Importy ikon SVG jako komponenty
// Zakładam ścieżkę @/assets/icons/ zgodnie z Twoim opisem
import MortarboardIcon from '@/assets/icons/Mortarboard.svg' // Średnia / Oceny
import AttendanceIcon from '@/assets/icons/Attendance.svg' // Frekwencja
import ExamIcon from '@/assets/icons/Exam.svg' // Sprawdziany
import ClockIcon from '@/assets/icons/Clock.svg' // Czas lekcji
import MapMarkerIcon from '@/assets/icons/map-marker-alt.svg' // Sala
import TeacherIcon from '@/assets/icons/Teacher.svg' // Nauczyciel
import CalendarIcon from '@/assets/icons/Calendar.svg' // Plan lekcji
import BookIcon from '@/assets/icons/Book.svg' // Prace domowe
import HomeIcon from '@/assets/icons/Home.svg' // Ustawienia
import Roll from '@/assets/icons/Roll.svg' // Średnia / Oceny

// Import Hooków
import { useGrades } from '@/hooks/useGrades'
import { useLessons } from '@/hooks/useLessons'
import { useAttendanceSummary } from '@/hooks/useAttendanceSummary'
import { useExams } from '@/hooks/useExams'
import { useHomework } from '@/hooks/useHomework'
import dayjs from 'dayjs'

// Formatowanie daty dla nagłówka
const getFormattedDate = () => {
  const date = new Date()
  return date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Logika następnej lekcji
const findNextLesson = (lessonsData: any[]) => {
  if (!lessonsData || !Array.isArray(lessonsData) || lessonsData.length === 0) return null

  const now = dayjs()
  // dayjs().day() zwraca 0 dla Niedzieli, 1 dla Poniedziałku itd.
  // W backendzie (controllers.py) dni są w liście od Poniedziałku (indeks 0).
  // Dlatego: (1 + 6) % 7 = 0 (Poniedziałek), (0 + 6) % 7 = 6 (Niedziela)
  const currentDayIndex = (now.day() + 6) % 7

  const currentTimeInMinutes = now.hour() * 60 + now.minute()

  const todayLessons = lessonsData[currentDayIndex]

  if (!todayLessons || !Array.isArray(todayLessons)) return null

  const next = todayLessons.find((lesson: any) => {
    if (!lesson.time) return false

    // Parsowanie czasu z formatu "HH:mm-HH:mm" (np. "08:00-08:45")
    const [startTimeStr, endTimeStr] = lesson.time.split('-')
    const [endHour, endMin] = endTimeStr.split(':').map(Number)
    const lessonEndTimeInMinutes = endHour * 60 + endMin

    // Lekcja jest "następna", jeśli jeszcze się nie skończyła
    return lessonEndTimeInMinutes > currentTimeInMinutes
  })

  return next || null
}

const HomeScreen = () => {
  const navigation = useNavigation<any>()
  const todayDateString = new Date().toISOString().split('T')[0]

  // Pobieranie danych z hooków
  const { avgGrade, isLoading: loadingGrades } = useGrades()
  const { attendanceSummary, isLoading: loadingAtt } = useAttendanceSummary('all')
  const { lessons, isPending: loadingLessons } = useLessons(todayDateString)
  const { exams, isLoading: loadingExams } = useExams()
  const { homework, isLoading: loadingHomework } = useHomework()

  const nextLesson = useMemo(() => findNextLesson(lessons), [lessons])

  const { upcomingExams, examsCount } = useMemo(() => {
    if (!exams) return { upcomingExams: [], examsCount: 0 }

    const now = new Date()
    now.setHours(0, 0, 0, 0) // Resetujemy godzinę, aby uwzględnić dzisiejsze sprawdziany

    const nextMonth = new Date()
    nextMonth.setMonth(now.getMonth() + 1) // Ustawiamy datę na "za miesiąc"

    // Filtrujemy sprawdziany: data większa/równa dzisiaj ORAZ mniejsza/równa dacie za miesiąc
    const filtered = exams.filter((exam: any) => {
      const examDate = new Date(exam.deadline)
      return examDate >= now && examDate <= nextMonth
    })

    return {
      upcomingExams: filtered, // Lista tylko z najbliższego miesiąca
      examsCount: filtered.length // Liczba do kafelka statystyk
    }
  }, [exams])

  const upcomingHomework = useMemo(() => {
    if (!homework) return []

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const nextMonth = new Date()
    nextMonth.setMonth(now.getMonth() + 1)

    // Filtrujemy prace domowe: termin >= dzisiaj ORAZ termin <= za miesiąc
    return homework.filter((hw: any) => {
      const hwDate = new Date(hw.deadline)
      return hwDate >= now && hwDate <= nextMonth
    })
  }, [homework])
  const isLoading = loadingGrades || loadingAtt || loadingLessons || loadingExams || loadingHomework

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F2F2F6]">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  // Stałe kolory ikon
  const ICON_BLUE = '#3b82f6' // Główny niebieski
  const ICON_WHITE = '#FFFFFF'

  return (
    <SafeAreaView className="bg-white">
      <ScrollView className="px-[20px]" refreshControl={<RefreshControl refreshing={isLoading} />}>
        {/* 1. HEADER */}
        <View className="flex-row justify-between items-start mb-6">
          <View>
            <Text className="font-poppinsBold text-[28px] text-black">Cześć!</Text>
            <Text className="font-poppins text-gray-500 text-[16px] capitalize">
              {getFormattedDate()}
            </Text>
          </View>
        </View>

        {/* 2. BOXY STATYSTYK */}
        <View className="flex-row justify-between mb-8 gap-[6px]">
          {/* Średnia */}
          <View className="flex-1 p-4 rounded-2xl gap-[1px] shadow-sm justify-between min-h-[100px] bg-blueGray">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mb-2">
              <MortarboardIcon width={18} height={18} color={ICON_BLUE} />
            </View>
            <Text className="font-poppins text-gray-500 text-[12px]">Średnia ocen</Text>
            <Text className="font-poppinsBold text-[18px] leading-tight text-black">
              {avgGrade ? avgGrade.toFixed(2) : '-'}
            </Text>
          </View>
          {/* Frekwencja */}
          <View className="flex-1 p-4 rounded-2xl gap-[1px] shadow-sm justify-between min-h-[100px] bg-blueGray">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mb-2">
              <AttendanceIcon width={18} height={18} color={ICON_BLUE} />
            </View>
            <Text className="font-poppins text-gray-500 text-[12px]">Frekwencja</Text>
            <Text className="font-poppinsBold text-[18px] leading-tight text-black">
              {attendanceSummary ? `${attendanceSummary.attendance_percentage.toFixed(2)}%` : '-'}
            </Text>
          </View>
          {/* Ilość sprawdzianów */}
          <View className="flex-1 p-4 rounded-2xl gap-[1px] shadow-sm justify-between min-h-[100px] bg-blueGray">
            <View className="bg-blue-100 w-8 h-8 rounded-lg items-center justify-center mb-2">
              <ExamIcon width={18} height={18} color={ICON_BLUE} />
            </View>
            <Text className="font-poppins text-gray-500 text-[12px]">Sprawdziany</Text>
            <Text className="font-poppinsBold text-[18px] leading-tight text-black">
              {examsCount}
            </Text>
          </View>
        </View>

        {/* 3. NASTĘPNA LEKCJA */}
        <Text className="font-poppinsBold text-[24px] mb-[8px] text-black">Następna lekcja</Text>
        <View className="bg-[#2B66FF] rounded-[20px] py-[16px] px-[12px] mb-8 shadow-md">
          {nextLesson ? (
            <>
              <Text className="text-white font-poppinsBold text-[16px] leading-tight mb-2">
                {nextLesson.name || 'Przedmiot'}
              </Text>
              <View className="flex-row gap-4 items-center">
                <View className="flex-row items-center gap-1">
                  <ClockIcon width={18} height={18} color={ICON_WHITE} />
                  <Text className="text-white font-poppins text-[14px] leading-tight">
                    {nextLesson.time}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MapMarkerIcon width={18} height={18} color={ICON_WHITE} />
                  <Text className="text-white font-poppins text-[14px] leading-tight">
                    Sala {nextLesson.room || '-'}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <TeacherIcon width={18} height={18} color={ICON_WHITE} />
                  <Text className="text-white font-poppins text-[14px] leading-tight">
                    {nextLesson.teacher?.split(' ')[0] || ''}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View className="items-center py-2">
              <Text className="text-white font-poppinsBold text-lg">Koniec lekcji na dziś!</Text>
            </View>
          )}
        </View>

        {/* 4. SZYBKI DOSTĘP */}
        <Text className="font-poppinsBold text-[24px] mb-[8px] text-black">Szybki dostęp</Text>
        <View className="flex-row flex-wrap justify-between gap-[6px] mb-8">
          <QuickAccessItem
            title="Strona główna"
            icon={<HomeIcon width={24} height={24} color={ICON_BLUE} />}
            onPress={() => navigation.navigate('mainpage')}
          />
          <QuickAccessItem
            title="Oceny"
            icon={<Roll width={24} height={24} color={ICON_BLUE} />}
            onPress={() => navigation.navigate('grades')}
          />
          <QuickAccessItem
            title="Plan lekcji"
            icon={<CalendarIcon width={24} height={24} color={ICON_BLUE} />}
            onPress={() => navigation.navigate('index')}
          />
          <QuickAccessItem
            title="Prace domowe"
            icon={<BookIcon width={24} height={24} color={ICON_BLUE} />}
            onPress={() => navigation.navigate('homework')}
          />
          <QuickAccessItem
            title="Sprawdziany"
            icon={<ExamIcon width={24} height={24} color={ICON_BLUE} />}
            onPress={() => navigation.navigate('exams')}
          />
          <QuickAccessItem
            title="Frekwencja"
            icon={<AttendanceIcon width={24} height={24} color={ICON_BLUE} />}
            onPress={() => navigation.navigate('attendance')}
          />
        </View>

        {/* 5. SPRAWDZIANY (Lista) */}
        <Text className="font-poppinsBold text-[24px] mb-[8px] text-black">Sprawdziany</Text>
        <View className="gap-3 mb-8">
          {upcomingExams.length > 0 ? (
            upcomingExams.map((exam: any, index: number) => (
              <View
                key={index}
                className="bg-white p-4 rounded-2xl flex-row items-center shadow-sm"
              >
                <View className="bg-blue-50 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <ExamIcon width={24} height={24} color={ICON_BLUE} />
                </View>
                <View className="flex-1">
                  <Text className="font-poppinsBold text-[#2B66FF] text-sm mb-0.5">
                    {exam.type}
                  </Text>
                  <Text className="font-poppinsBold text-black text-lg leading-tight">
                    {exam.subject}
                  </Text>
                  <Text className="font-poppins text-gray-500 text-xs mt-1">
                    {exam.content} • {exam.deadline}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="font-poppins text-gray-500">Brak nadchodzących sprawdzianów.</Text>
          )}
        </View>

        {/* 6. PRACE DOMOWE (Lista) */}
        <Text className="font-poppinsBold text-[24px] mb-[8px] text-black">Prace domowe</Text>
        <View className="gap-3 mb-4">
          {upcomingHomework.length > 0 ? (
            upcomingHomework.map((hw: any, index: number) => (
              <View
                key={index}
                className="bg-white p-4 rounded-2xl flex-row items-center shadow-sm"
              >
                <View className="bg-blue-50 w-12 h-12 rounded-xl items-center justify-center mr-4">
                  <BookIcon width={24} height={24} color={ICON_BLUE} />
                </View>
                <View className="flex-1">
                  <Text className="font-poppinsBold text-black text-lg leading-tight">
                    {hw.subject}
                  </Text>
                  <Text className="font-poppins text-gray-500 text-xs mt-1" numberOfLines={2}>
                    {hw.content}
                  </Text>
                  <Text className="font-poppinsBold text-[#2B66FF] text-xs mt-1">
                    Termin: {hw.deadline}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="font-poppins text-gray-500">Brak zadań domowych.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Komponent pomocniczy dla kafelka Szybkiego Dostępu
const QuickAccessItem = ({
  title,
  icon,
  onPress
}: {
  title: string
  icon: React.ReactNode
  onPress: () => void
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-blueGray w-[49%] p-4 rounded-2xl flex-col gap-3 shadow-sm mb-1"
  >
    {icon}
    <Text className="font-poppinsBold text-[14px] flex-1 flex-wrap text-black leading-tight">
      {title}
    </Text>
  </TouchableOpacity>
)

export default HomeScreen
