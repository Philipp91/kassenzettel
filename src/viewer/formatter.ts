const twoDecimalFormatter = new Intl.NumberFormat([], {minimumFractionDigits: 2, maximumFractionDigits: 2});

export function formatPrice(price: number) {
    return twoDecimalFormatter.format(price);
}
