import dayjs from 'dayjs'
import 'dayjs/locale/pl'

dayjs.locale('pl')

const getStartAndEndOfWeek = (todayDate: string) => {
  return {
    startOfWeek: dayjs(todayDate).startOf('week').format('YYYY-MM-DD'),
    endOfWeek: dayjs(todayDate).endOf('week').format('YYYY-MM-DD')
  }
}

export { getStartAndEndOfWeek }
