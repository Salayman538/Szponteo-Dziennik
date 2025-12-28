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
      <View className={`bg-blueGray p-4 rounded-3xl ${className}`}>
        <View className="flex flex-row justify-between items-center mb-1">
          <Text className="flex-1 font-bold text-xl mr-2" numberOfLines={1} ellipsizeMode="tail">
            {task.subject}
          </Text>
          <View className="bg-primary rounded-full px-3 py-1 justify-center items-center">
            <Text className="text-white font-bold">
              {dayjs(task.deadline).format('DD.MM.YYYY')}
            </Text>
          </View>
        </View>

        <Text>
          {'type' in task && <Text className="font-bold">{task.type}, </Text>}
          {task.content}
        </Text>
      </View>
    </>
  )
}

export default TaskCard
