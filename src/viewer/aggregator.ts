export default function aggregate(purchases: Purchase[]): ProductGroups {
    const groups: ProductGroups = {};
    for (const purchase of purchases) {
        groups[purchase.item] = (groups[purchase.item] || 0) + purchase.totalPrice;
    }
    return groups
}
