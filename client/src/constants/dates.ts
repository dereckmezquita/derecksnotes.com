export const DATE_FORMAT = 'YYYY-MM-DD';

export const TIME_FORMAT = 'HH:mm:ss';

export const DATETIME_FORMAT = `${DATE_FORMAT} - ${TIME_FORMAT}`;

export const MILLISECONDS_IN_ONE_DAY = 86400000;

export enum DAYS_OF_WEEK {
    MON = 0,
    TUE,
    WED,
    THU,
    FRI,
    SAT,
    SUN
}

export enum MONTHS_OF_YEAR {
    JAN = 0,
    FEB,
    MAR,
    APR,
    MAY,
    JUN,
    JUL,
    AUG,
    SEP,
    OCT,
    NOV,
    DEC
}

export function FORMAT_DATE_YYYY_MM_DD_HHMMSS(d: Date | string): string {
    const date = d instanceof Date ? d : new Date(d);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}, ${hour}:${minute}:${second}`;
}
