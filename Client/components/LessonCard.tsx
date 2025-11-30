import React from 'react'
import { View, Text } from 'react-native'
import { Lesson } from '../types/common'
import Teacher from '../assets/icons/Teacher.svg'
import MapMarker from '../assets/icons/map-marker-alt.svg'

interface LessonCardProps {
  lesson: Lesson
}

const LessonCard = ({ lesson }: LessonCardProps) => {
  const isCanceled = lesson.status === 'Odwołana'
  const isSubstituted = lesson.status !== undefined && lesson.status !== 'Odwołana'
  const ltime = lesson.time.split('-')
  return (
    <View className={`p-2 border-b-[1px] border-whiteGray flex-row justify-between pb-[10px] mt-[5px]`}>
      <View className={`w-[25%]`}>
        <Text className='text-[18px] font-poppinsMedium text-black'>{ltime[0]}</Text>
        <Text className='text-[16px] font-poppinsMedium text-darkGray'>{ltime[1]}</Text>
      </View>
      <View className={`w-[77.5%]`}>
        
        {isSubstituted ? (
          <View>
            <View className='bg-blueGray rounded-t-3xl pt-[10px] pb-[10px] pl-[12px] pr-[12px]'>
            <Text className='font-poppinsBold text-[16px] text-black'>{lesson.status}</Text>
              <View className='flex-row mt-[5px] mb-[5px]'>
                <MapMarker width={18} height={18} />
                <Text className='ml-[5px] font-poppins text-[14px] text-black'>Sala {lesson.room}</Text>
              </View>
                {lesson.teacher ? (
                    <View className='flex-row'>
                      <Teacher width={18} height={18} />
                      <Text className='ml-[5px] font-poppins text-[14px] text-black'>{lesson.teacher}</Text>
                    </View>

                  ): ""}
          </View>
                    <View className='bg-primary rounded-b-3xl h-[25px] flex justify-center'>
                      <Text className='ml-[20px] font-poppinsMedium text-[12px] text-white'>Zastępstwo</Text>
                    </View>
          </View>
        ): isCanceled ? (
          <View>
            <View className='bg-blueGray rounded-t-3xl pt-[10px] pb-[10px] pl-[12px] pr-[12px]'>
              <Text className='font-poppinsBold text-[16px] text-black line-through'>{lesson.name}</Text>
            </View>

            <View className='bg-primary rounded-b-3xl h-[25px] flex justify-center'>
              <Text className='ml-[20px] font-poppinsMedium text-[12px] text-white'>{lesson.status}</Text>
            </View>
          </View>
        ) : (
          <View>
            <View className='bg-blueGray rounded-3xl pt-[10px] pb-[10px] pl-[12px] pr-[12px]'>
                <Text className='font-poppinsBold text-[16px] text-black'>{lesson.name}</Text>
              <View className='flex-row mt-[5px] mb-[5px]'>
                <MapMarker width={18} height={18} />
                <Text className='ml-[5px] font-poppins text-[14px] text-black'>Sala {lesson.room}</Text>
              </View>
            {lesson.teacher ? (
              <View className='flex-row'>
              <Teacher width={18} height={18} />
            <Text className='ml-[5px] font-poppins text-[14px] text-black'>{lesson.teacher}</Text>
        </View>
        ):"" }
            </View>
        </View>
          )}
      </View>
    </View>
  )
}

export default LessonCard