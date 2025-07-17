import dayjs from "dayjs"
import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("id") // set locale ke Indonesia

export const getLocalTimestamp = () => {
 return dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
}

export const convertToLocal = (utcTimestamp) => {
 if (!utcTimestamp) return getLocalTimestamp()
 return dayjs(utcTimestamp).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
}
