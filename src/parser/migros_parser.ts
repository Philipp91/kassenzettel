import assert from "../util/assert";
import {parseGermanDatetime, parseNumber, roundPrice} from "./common";

export function parseMigrosCsv(csvContent: string): Purchase[] {
    const lines = csvContent.split('\n').map(l => l.trim());
    assert(lines[0] === 'Datum;Zeit;Filiale;Kassennummer;Transaktionsnummer;Artikel;Menge;Aktion;Umsatz', `Invalid header: ${lines[0]}`);
    return lines.slice(1).filter(l => l).map(parseLine).filter(p => p.totalPrice);
}

function parseLine(line: string): Purchase {
    const cells = line.split(';');
    assert(cells.length === 9, `Invalid line: ${line}`);

    const quantity = parseNumber(cells[6]);
    const rebate = Math.abs(parseNumber(cells[7]));
    const totalPrice = parseNumber(cells[8]);
    return {
        datetime: parseGermanDatetime(cells[0], cells[1]),
        item: cells[5].trim().replaceAll(/(\.)(\w)/g, '$1 $2'),
        basePrice: roundPrice((totalPrice + rebate) / quantity),
        quantity, rebate, totalPrice,
        store: cells[2],
    };
}
