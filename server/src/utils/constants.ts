
export function DATETIME_YYYY_MM_DD_HHMMSS(): string {
    return new Date().toISOString().replace('T', '-').slice(0, 19).replace(/:/g, '');
}
