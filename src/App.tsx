import React, {useEffect, useState} from 'react';
import {errorToString} from "./util/assert";
import {parseMigrosCsv} from "./parser/migros_parser";
import Viewer from "./viewer/Viewer";
import aggregate from "./viewer/aggregator";
import {FlexRow} from "./util/flexbox";
import NameMappingsEditor from "./viewer/NameMappingsEditor";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {loadMappings, storeMappings} from "./model/storage";

export const Demo: React.FC = () => {
    const [purchases, setPurchases] = useState<Purchase[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        setPurchases(null);
        const loadPurchases = async (filename: string) => {
            try {
                const response = await fetch(filename);
                const csvData = await response.text();
                setPurchases(oldPurchases => [...(oldPurchases || []), ...parseMigrosCsv(csvData)]);
            } catch (e) {
                setError(errorToString(e));
            }
        };
        loadPurchases('receipts-details.csv').catch(console.error);
    }, []);

    if (error) {
        return <div style={{textAlign: 'center', padding: 20}}>Error: {error}</div>;
    }
    if (!purchases) {
        return <div style={{textAlign: 'center', padding: 20}}>Loading...</div>;
    }
    return <App purchases={purchases}/>;
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

    const productGroups = aggregate(purchases, nameMappings);
    return <DndProvider backend={HTML5Backend}>
        <FlexRow style={{height: '100%'}}>
            <div style={{height: '100%', overflowY: 'auto'}}>
                <Viewer productGroups={productGroups} nameMappings={nameMappings}
                        onAddMappings={newMapings => setMappings(({...nameMappings, ...newMapings}))}
                        containerStyle={{margin: 30}}/>
            </div>
            <div style={{height: '100%', overflowY: 'auto', flexGrow: 1}}>
                <NameMappingsEditor nameMappings={nameMappings} onReplaceMappings={setMappings}
                                    containerStyle={{margin: 32}}/>
            </div>
        </FlexRow>
    </DndProvider>;
};
