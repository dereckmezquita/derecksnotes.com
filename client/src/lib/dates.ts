export function DATE_YYYY_MM_DD(date: string): string {
    return new Date(date).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
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
