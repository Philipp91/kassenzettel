import React, {useState} from "react";
import {formatPrice} from "./formatter";

export interface ViewerProps {
    productGroups: ProductGroups;
}

type SortField = 'name' | 'price';

function sortProductGroups(productGroups: ProductGroups, sortField: SortField): [string, number][] {
    const result = Object.entries(productGroups);
    if (sortField === 'name') {
        result.sort((a, b) => a[0].localeCompare(b[0]));
    } else if (sortField === 'price') {
        result.sort((a, b) => b[1] - a[1]);
    }
    return result;
}

const Viewer: React.FC<ViewerProps> = ({productGroups}) => {
    const [sortField, setSortField] = useState<SortField>('name');
    return <table>
        <thead>
        <tr>
            <th onClick={() => setSortField('name')}>Produkt {sortField === 'name' && '▲'}</th>
            <th onClick={() => setSortField('price')}>Gesamtpreis [Fr] {sortField === 'price' && '▼'}</th>
        </tr>
        </thead>
        <tbody>
        {sortProductGroups(productGroups, sortField).map(([name, totalPrice]) =>
            <tr key={name}>
                <td>{name}</td>
                <td style={{textAlign: 'end'}}>{formatPrice(totalPrice)}</td>
            </tr>)}
        </tbody>
    </table>;
};

Viewer.displayName = 'Viewer';
export default Viewer;
