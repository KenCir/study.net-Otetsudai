import { DayDate } from '../interfaces';

function getDayDate(): DayDate {
    const date = new Date();
    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
}

export {
    getDayDate,
};