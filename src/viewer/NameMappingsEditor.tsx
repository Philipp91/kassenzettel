import React, {CSSProperties} from "react";
import {useDrop} from "react-dnd";
import {mapGroupToName} from "./aggregator";

export interface NameMappingsEditorProps {
    nameMappings: NameMappings;
    onReplaceMappings: (newMappings: NameMappings) => void;
    containerStyle?: CSSProperties;
}

const explanationText = 'Produkte durch Ziehen mit der Maus in der Liste links zusammenfassen.';

const NameMappingGroup: React.FC<{
    groupName: string,
    itemNames: Set<string>,
    onRename: () => void,
    onDelete: (itemName: string) => void,
    onDrop: (droppedGroups: ProductGroup[]) => void
}> = (
    {groupName, itemNames, onRename, onDelete, onDrop}
) => {
    const [{isOver}, drop] = useDrop<ProductGroup | ProductGroup[], {}, { isOver: boolean, dragItem: ProductGroup }>({
        accept: ['ProductGroup', 'Total'],
        canDrop: item => Array.isArray(item) || item.name !== groupName,
        collect: (monitor) => ({
            isOver: monitor.isOver() && monitor.canDrop(),
            dragItem: monitor.getItem(),
        }),
        drop: item => {
            onDrop(Array.isArray(item) ? item : [item]);
            return undefined;
        },
    });
    const sortedItemNames = Array.from(itemNames);
    sortedItemNames.sort();
    return <li ref={drop}>
        <span style={{
            fontWeight: isOver ? 'bold' : 'normal',
            textDecoration: 'underline',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
        }} onClick={onRename}>{groupName}</span>
        {' = {'}
        {sortedItemNames.map(itemName => <span key={itemName} style={{margin: 6, whiteSpace: 'nowrap'}}>
            {itemName}
            <button
                className="hide-button-unless-hovered"
                style={{verticalAlign: "middle"}}
                onClick={() => onDelete(itemName)}>
                🗑
            </button>
        </span>)}
        {'}'}
    </li>;
};

const CreateNewGroup: React.FC<{ onDrop: (droppedGroups: ProductGroup[]) => void }> = ({onDrop}) => {
    const [{isOver}, drop] = useDrop<ProductGroup | ProductGroup[], {}, { isOver: boolean, dragItem: ProductGroup }>({
        accept: ['ProductGroup', 'Total'],
        collect: (monitor) => ({
            isOver: monitor.isOver() && monitor.canDrop(),
            dragItem: monitor.getItem(),
        }),
        drop: item => {
            onDrop(Array.isArray(item) ? item : [item]);
            return undefined;
        },
    });
    return <li ref={drop} style={{fontWeight: isOver ? 'bold' : 'normal'}}>
        Neue Gruppe erstellen (Produkt hierher ziehen)
    </li>;
};

const NameMappingsEditor: React.FC<NameMappingsEditorProps> = (
    {nameMappings, onReplaceMappings, containerStyle}
) => {
    const groups: Record<string, Set<string>> = {};
    for (const [itemName, groupName] of Object.entries(nameMappings)) {
        let group = groups[groupName];
        if (!group) {
            groups[groupName] = group = new Set();
        }
        group.add(itemName);
    }

    const sortedGroups = Object.entries(groups);
    sortedGroups.sort((a, b) => a[0].localeCompare(b[0]));
    return <div style={containerStyle}>
        <h4>
            Produkt-Zusammenfassungen
            <button
                className="hide-button-unless-hovered"
                style={{verticalAlign: "middle"}}
                onClick={() => {
                    if (!window.confirm('Wirklich alle Zuweisungen löschen?')) return;
                    onReplaceMappings({});
                }}>
                🗑
            </button>
        </h4>
        {!sortedGroups.length && explanationText}
        <ul>
            {sortedGroups.map(([groupName, itemNames]) =>
                <NameMappingGroup key={groupName} groupName={groupName} itemNames={itemNames}
                                  onRename={() => {
                                      const newName = prompt('Gruppe umbenennen', groupName);
                                      if (!newName) return;
                                      const newMappings = {...nameMappings};
                                      for (const itemName of Array.from(itemNames)) newMappings[itemName] = newName;
                                      onReplaceMappings(newMappings);
                                  }}
                                  onDelete={(itemName) => {
                                      const newMappings = {...nameMappings};
                                      delete newMappings[itemName];
                                      onReplaceMappings(newMappings);
                                  }}
                                  onDrop={droppedGroups => {
                                      onReplaceMappings({
                                          ...nameMappings,
                                          ...mapGroupToName(droppedGroups, groupName),
                                      });
                                  }}/>)}
            <CreateNewGroup onDrop={droppedGroups => {
                const newName = prompt(
                    'Bitte den Namen für die neue Gruppe eingeben.',
                    droppedGroups.length === 1 ? droppedGroups[0].name : ''
                );
                if (!newName) return;
                onReplaceMappings({
                    ...nameMappings,
                    ...mapGroupToName(droppedGroups, newName),
                });
            }}/>
        </ul>
    </div>;
};

NameMappingsEditor.displayName = 'NameMappingsEditor';
export default NameMappingsEditor;
