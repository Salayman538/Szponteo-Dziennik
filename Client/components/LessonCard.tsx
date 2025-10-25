import React from 'react'
import { View, Text, Image } from 'react-native'
import { Lesson } from '../types/common'
import { Ionicons } from '@expo/vector-icons'
import Teacher from '../assets/icons/Teacher.svg'

interface LessonCardProps {
  lesson: Lesson
}

const LessonCard = ({ lesson }: LessonCardProps) => {
  const isChanged = lesson.changes_id
  const teacherName = lesson.teacher ? lesson.teacher.split(' ') : ''

  return (
    <View
      className={`
      m-2 p-5 rounded-xl shadow-md
      ${isChanged ? (lesson.teacher ? 'bg-yellow-50' : 'bg-red-50') : 'bg-white'}
    `}
    >
      <View className="flex-row items-center">
        <View
          className={`
          w-12 h-12 rounded-full flex items-center justify-center mr-4
          ${isChanged ? (lesson.teacher ? 'bg-yellow-600' : 'bg-red-600') : 'bg-blue-600'}
        `}
        >
          <Text
            className={`
            text-2xl font-bold text-white
          `}
          >
            {lesson.position}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-lg font-semibold text-gray-800">{lesson.name}</Text>
            <Text className="text-m text-gray-600 ml-3 mt-1">
              {isChanged && lesson.teacher ? `${lesson.teacher}` : ''}
            </Text>
          </View>
          <View className="flex-row items-center my-1">
            <Ionicons name="time-outline" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-600 ml-1">{lesson.time}</Text>

            {lesson.teacher ? (
              <>
                <Ionicons name="location-outline" size={16} color="#4B5563" className="ml-3" />
                <Text className="text-sm text-gray-600 ml-1">Sala {lesson.room}</Text>
                <View className='ml-2 flex flex-row'>
                  <Teacher width={16} height={16} color="#4B5563" />
                  <Text className="text-sm text-gray-700 ml-1">
                    {teacherName[0].substring(0, 1)}. {teacherName[1].substring(0, 1)}
                  </Text>
                </View>
              </>
            ) : (
              ''
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default LessonCard