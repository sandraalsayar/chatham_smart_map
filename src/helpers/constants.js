import { subDays } from "date-fns";

const today = new Date();
const yesterday = subDays(today, 1); // yesterday

export { yesterday, today };
