import {subDays} from "date-fns"

const today = new Date()
const startDate = subDays(today, 1) // yesterday

export {
    today,
    startDate
}