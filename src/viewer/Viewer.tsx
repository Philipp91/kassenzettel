import React, {CSSProperties, useState} from "react";
import {formatPrice} from "./formatter";
import {useDrag, useDrop} from "react-dnd";
import {mergeNames, proposeNewMappings} from "./aggregator";

export interface ViewerProps {
    productGroups: ProductGroups;
    nameMappings: NameMappings;
    onAddMappings: (newMappings: NameMappings) => void;
    containerStyle?: CSSProperties;
}

type SortField = 'name' | 'price';

function sortProductGroups(productGroups: ProductGroups, sortField: SortField): ProductGroup[] {
    const result = Object.values(productGroups);
    if (sortField === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortField === 'price') {
        result.sort((a, b) => b.totalPrice - a.totalPrice);
    }
    return result;
}

const ProductGroupRow: React.FC<{ group: ProductGroup, onAddMappings: ViewerProps['onAddMappings'] }> = (
    {group, onAddMappings}
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
    const dragStyle: CSSProperties = {opacity: 0.5, transform: 'translateX(-30px)'};
    const overStyle: CSSProperties = {fontWeight: 'bold', transform: 'translateX(-30px)'};
    return <tr ref={drag} style={isDragging ? dragStyle : {}}>
        <td ref={drop} style={isOver ? overStyle : {}}>{displayName}</td>
        <td style={{textAlign: 'end'}}>{formatPrice(group.totalPrice)}</td>
    </tr>
};

const Viewer: React.FC<ViewerProps> = ({productGroups, onAddMappings, containerStyle}) => {
    const [sortField, setSortField] = useState<SortField>('name');
    return <table style={containerStyle}>
        <thead>
        <tr>
            <th onClick={() => setSortField('name')}>Produkt {sortField === 'name' && '▲'}</th>
            <th onClick={() => setSortField('price')}>Gesamtpreis [Fr] {sortField === 'price' && '▼'}</th>
        </tr>
        </thead>
        <tbody>
        {sortProductGroups(productGroups, sortField).map(group =>
            <ProductGroupRow key={group.name} group={group} onAddMappings={onAddMappings}/>)}
        </tbody>
    </table>;
};

Viewer.displayName = 'Viewer';
export default Viewer;
