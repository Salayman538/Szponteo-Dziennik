import { View, Text } from 'react-native'
import dayjs from 'dayjs'
import { Exam, Homework } from '@/types/common'

dayjs.locale('pl')

interface TaskCardProps {
  task: Exam | Homework
  className: string
}

const TaskCard = ({ task, className }: TaskCardProps) => {
  return (
    <>
      <View className={`bg-blueGray p-[14px] rounded-3xl ${className}`}>
        <View className="flex flex-row justify-between items-center mb-1">
          <Text
            className="flex-1 font-poppinsBold text-[18px] text-black"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {task.subject}
          </Text>
          <View className="bg-primary rounded-full px-[13px] py-[4px] justify-center items-center">
            <Text className="text-white font-poppinsBold text-[12px] leading-tight">
              {dayjs(task.deadline).format('DD.MM.YYYY')}
            </Text>
          </View>
        </View>

        <Text className="text-black text-[13px] font-poppins">
          {'type' in task && <Text className="font-poppinsBold">{task.type}, </Text>}
          {task.content}
        </Text>
      </View>
    </>
  )
}

export default TaskCard
