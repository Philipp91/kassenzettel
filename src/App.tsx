import React, {useState} from 'react';
import assert, {errorToString} from "./util/assert";
import {parseMigrosCsv} from "./parser/migros_parser";
import Viewer from "./viewer/Viewer";
import aggregate from "./viewer/aggregator";
import {FlexCol, FlexRow} from "./util/flexbox";
import NameMappingsEditor from "./viewer/NameMappingsEditor";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {loadMappings, storeMappings} from "./model/storage";
import {downloadJson} from "./util/download";
import Button from "./viewer/Button";
import {showFileDialog} from "./util/file_dialog";

function assertValidJsonImport(value: unknown): asserts value is Purchase[] {
    assert(Array.isArray(value));
    for (const item of value) {
        assert(typeof item === 'object');
        assert(item.datetime && item.item && item.quantity);
        if (typeof item.datetime === 'string') {
            item.datetime = new Date(item.datetime);
        }
    }
}

export const ImportApp: React.FC = () => {
    const [purchases, setPurchases] = useState<Purchase[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    if (error) {
        return <div style={{textAlign: 'center', padding: 20}}>Error: {error}</div>;
    }
    if (purchases) {
        return <App purchases={purchases}/>;
    }
    return <Button icon="🗁 Öffnen" onClick={async () => {
        try {
            const file = await showFileDialog('application/json, text/csv');
            const data = await file.text();
            if (file.type === 'application/json') {
                const importedPurchases = JSON.parse(data);
                assertValidJsonImport(importedPurchases);
                setPurchases(importedPurchases);
            } else if (file.type === 'text/csv') {
                setPurchases(oldPurchases => [...(oldPurchases || []), ...parseMigrosCsv(data)]);
                console.error(file.type);
            }
        } catch (e) {
            setError(errorToString(e));
        }
    }}/>;
};

export const ParsingApp: React.FC<{ csvDatas: string[] }> = ({csvDatas}) => {
    try {
        const purchases = csvDatas.flatMap(parseMigrosCsv);
        return <App purchases={purchases}/>;
    } catch (e) {
        return <div>Error: {errorToString(e)}</div>;
    }
};

const App: React.FC<{ purchases: Purchase[] }> = ({purchases}) => {
    const [nameMappings, setNameMappings] = useState<NameMappings>(loadMappings() || {});
    const setMappings = (newMappings: NameMappings) => {
        setNameMappings(newMappings);
        storeMappings(newMappings);
    };

    if (!purchases.length) return <div>Leerer Datensatz</div>;
    const dates = purchases.map(p => p.datetime.getTime());
    const minDate = new Date(Math.min.apply(null, dates));
    const maxDate = new Date(Math.max.apply(null, dates));

    const productGroups = aggregate(purchases, nameMappings);
    return <DndProvider backend={HTML5Backend}>
        <FlexRow style={{height: '100%'}}>
            <FlexCol style={{height: '100%', overflowY: 'auto', flexShrink: 0}}>
                <div style={{margin: '4px 8px'}}>
                    Käufe von {minDate.toLocaleDateString()} bis {maxDate.toLocaleDateString()}
                    <Button icon="🖫 Export" title="Ursprüngliche Kassenzettel exportieren"
                            onClick={() => downloadJson(purchases, 'kassenzettel-purchases.json')}/>
                </div>
                <Viewer productGroups={productGroups} nameMappings={nameMappings}
                        onAddMappings={newMapings => setMappings(({...nameMappings, ...newMapings}))}
                        containerStyle={{margin: '0 30px 30px 30px'}}/>
            </FlexCol>
            <div style={{height: '100%', overflowY: 'auto', flexGrow: 1}}>
                <NameMappingsEditor originalPurchases={purchases}
                                    nameMappings={nameMappings} onReplaceMappings={setMappings}
                                    containerStyle={{margin: '40px 30px 30px 30px'}}/>
            </div>
        </FlexRow>
    </DndProvider>;
};
