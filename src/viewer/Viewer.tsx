import React, {CSSProperties, useState} from "react";
import {formatDecimal, formatPercent, formatPrice} from "./formatter";
import {useDrag, useDrop} from "react-dnd";
import {mergeNames, proposeNewMappings} from "./aggregator";
import Button from "./Button";
import {download} from "../util/download";

export interface ViewerProps {
    productGroups: ProductGroups;
    nameMappings: NameMappings;
    onAddMappings: (newMappings: NameMappings) => void;
    containerStyle?: CSSProperties;
}

type SortField = 'name' | 'price';

const dragStyle: CSSProperties = {opacity: 0.5, transform: 'translateX(-20px)'};
const overStyle: CSSProperties = {fontWeight: 'bold', transform: 'translateX(-20px)'};

const ProductGroupRow: React.FC<{ group: ProductGroup, onAddMappings: ViewerProps['onAddMappings'], grandTotal: number }> = (
    {group, onAddMappings, grandTotal}
) => {
    const [{isDragging}, drag] = useDrag<ProductGroup, {}, { isDragging: boolean }>({
        type: 'ProductGroup',
        item: group,
        collect: (monitor) => ({isDragging: monitor.isDragging()}),
    });
    const [{isOver, dragItem}, drop] = useDrop<ProductGroup, {}, { isOver: boolean, dragItem: ProductGroup }>({
        accept: 'ProductGroup',
        canDrop: item => item.name !== group.name,
        collect: (monitor) => ({
            isOver: monitor.isOver() && monitor.canDrop(),
            dragItem: monitor.getItem(),
        }),
        drop: item => {
            onAddMappings(proposeNewMappings(item, group));
            return undefined;
        },
    });

    let displayName = group.name;
    if (isOver) {
        displayName = mergeNames(group.name, dragItem.name) || displayName;
    }
    return <tr ref={drop} style={isDragging ? dragStyle : {}}>
        <td ref={drag} style={isOver ? overStyle : {}}>{displayName}</td>
        <td style={{textAlign: 'end'}}>{formatPrice(group.totalPrice)}</td>
        <td style={{textAlign: 'end'}}>{formatPercent(group.totalPrice / grandTotal)}</td>
    </tr>
};

const TotalRow: React.FC<{ renderedGroups: ProductGroup[], grandTotal: number }> = ({renderedGroups, grandTotal}) => {
    const [{isDragging}, drag] = useDrag<ProductGroup[], {}, { isDragging: boolean }>({
        type: 'Total',
        item: renderedGroups,
        collect: (monitor) => ({isDragging: monitor.isDragging()}),
    });
    return <tr>
        <td ref={drag} style={isDragging ? dragStyle : {}}><b>Total</b></td>
        <td style={{textAlign: 'end'}}><b>{formatPrice(grandTotal)}</b></td>
        <td style={{textAlign: 'end'}}><b>{formatPercent(1.0)}</b></td>
    </tr>;
};

const Viewer: React.FC<ViewerProps> = ({productGroups, onAddMappings, containerStyle}) => {
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const renderedGroups = Object.values(productGroups).filter(g => !filter || g.name.toLowerCase().includes(filter));
    const grandTotal = Object.values(productGroups).map(g => g.totalPrice).reduce((a, b) => a + b);
    if (sortField === 'name') {
        renderedGroups.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortField === 'price') {
        renderedGroups.sort((a, b) => b.totalPrice - a.totalPrice);
    }
    const triggerCsvDownload = () => {
        const csvData = 'Produkt;Gesamtpreis [Fr]\n'
            + renderedGroups.map(g => `${g.name};${formatDecimal(g.totalPrice)}\n`).join('')
            + `Total;${formatDecimal(grandTotal)}\n`;
        download(csvData, 'text/csv', 'kassenzettel-analyse.csv');
    };
    return <table style={containerStyle}>
        <thead>
        <tr>
            <th>
                <span onClick={() => setSortField('name')}>Produkt {sortField === 'name' && '▲'}</span>
                <input type="text" value={filter} placeholder="Filter"
                       style={{width: 80, marginLeft: 8}}
                       onInput={e => setFilter((e.target as HTMLInputElement).value.toLowerCase())}/>
                <Button icon="🖫" title="Gefilterte, gruppierte Preise exportieren" onClick={triggerCsvDownload}/>
            </th>
            <th onClick={() => setSortField('price')} style={{textAlign: 'end'}}>
                Gesamtpreis {sortField === 'price' && '▼'}
            </th>
            <th onClick={() => setSortField('price')} style={{textAlign: 'end'}}>
                Anteil {sortField === 'price' && '▼'}
            </th>
        </tr>
        </thead>
        <tbody>
        {renderedGroups.map(group =>
            <ProductGroupRow key={group.name} group={group}
                             onAddMappings={onAddMappings} grandTotal={grandTotal}/>)}
        <TotalRow renderedGroups={renderedGroups} grandTotal={grandTotal}/>
        </tbody>
    </table>;
};

Viewer.displayName = 'Viewer';
export default Viewer;
