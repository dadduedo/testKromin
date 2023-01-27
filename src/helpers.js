import dayjs from "dayjs";

export const toSQL = (date = new Date()) =>
  dayjs(date).format("YYYY-MM-DD HH:mm:ss");
