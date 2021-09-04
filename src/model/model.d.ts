interface Purchase {
    datetime: Date;
    item: string;
    basePrice: number;
    quantity: number;
    rebate: number;  // positive number
    totalPrice: number;  // should be quantity*basePrice - rebate
    store: string;
}
