import assert from "../util/assert";

// ('dd.MM.yyyy', 'hh:mm:ss') -> Date
export function parseGermanDatetime(germanDate: string, time: string): Date {
    const parts = germanDate.split('.');
    assert(parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4, `Invalid date: ${germanDate}`);
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${time}`);
}

// "12.34" -> 12.34
export function parseNumber(value: string): number {
    const result = Number(value);
    assert(!isNaN(result), `Invalid number: ${value}`);
    return result;
}

// Rounds to two digits, which is normal for prices.
export function roundPrice(value: number): number {
    return Math.round(value * 100) / 100.0
}
