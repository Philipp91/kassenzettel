interface Purchase {
    datetime: Date;
    item: string;
    basePrice: number;
    quantity: number;
    rebate: number;  // positive number
    totalPrice: number;  // should be quantity*basePrice - rebate
    store: string;
}

interface ProductGroup {
    name: string;
    totalPrice: number;
    purchases: Purchase[];
}

type ProductGroups = Record<string, ProductGroup>; // keyed by name

type NameMappings = Record<string, string>; // No value should also appear as key.
