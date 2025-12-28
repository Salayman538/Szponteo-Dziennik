import AttendanceSummary from '@/app/AttendanceSummary'
import { View } from 'react-native'

const AttendanceStatistics = () => {
  return (
    <View className="flex  mb-5">
      <AttendanceSummary />
    </View>
  )
}

export default AttendanceStatistics
