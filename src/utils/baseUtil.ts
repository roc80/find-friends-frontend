export function isPositiveInteger(value: any): boolean {
    const num = typeof value === 'string' ? Number(value) : value;
    return typeof num === 'number' && Number.isInteger(num) && num > 0;
}