const twoDecimalFormatter = new Intl.NumberFormat(['de-CH'], {minimumFractionDigits: 2, maximumFractionDigits: 2});

export function formatDecimal(value: number): string {
    return twoDecimalFormatter.format(value);
}

export function formatPrice(price: number): string {
    return twoDecimalFormatter.format(price) + ' Fr';
}

export function formatPercent(fraction: number): string {
    return twoDecimalFormatter.format(fraction * 100) + '%';
}
