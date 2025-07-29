import moment from "moment";
moment.locale("th")
export const dateFormat = (date: string) => moment(date).format("DD/MM/YYYY - HH:mm:ss");

export const getCurrentDate = () => moment().format("YYYY-MM-DDTHH:mm:ss");

export const dateFormFormat = (date: string) => moment(date).format("YYYY-MM-DDTHH:mm:ss+07:00");

export const dateInputFormFormat = (date: string) => moment(date).format("YYYY-MM-DDTHH:mm:ss");