import {parseMigrosCsv} from "./migros_parser";

it('parses correctly', () => {
    const input =
        'Datum;Zeit;Filiale;Kassennummer;Transaktionsnummer;Artikel;Menge;Aktion;Umsatz\r\n' +
        '09.08.2021;11:43:57;MM Wiedikon;254;27;Bio Pouletunterschenke;0.304;0;7.6\r\n' +
        '28.08.2021;12:07:28;MM Wiedikon;254;40;Coca-Cola 6x1.5L;1;-5.65;6.95\n';
    expect(parseMigrosCsv(input)).toEqual([{
        datetime: new Date('2021-08-09T11:43:57'),
        item: 'Bio Pouletunterschenke',
        basePrice: 25.00,
        quantity: 0.304,
        rebate: 0,
        totalPrice: 7.60,
        store: 'MM Wiedikon',
    }, {
        datetime: new Date('2021-08-28T12:07:28'),
        item: 'Coca-Cola 6x1.5L',
        basePrice: 12.60,
        quantity: 1,
        rebate: 5.65,
        totalPrice: 6.95,
        store: 'MM Wiedikon',
    }]);
});
