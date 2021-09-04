import React, {useEffect, useState} from 'react';
import {errorToString} from "./util/assert";
import {parseMigrosCsv} from "./parser/migros_parser";
import Viewer from "./viewer/Viewer";
import aggregate from "./viewer/aggregator";
import {FlexCol} from "./util/flexbox";

function App() {
    const [purchases, setPurchases] = useState<Purchase[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
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

    const productGroups = aggregate(purchases);
    return <FlexCol alignItems="center">
        <Viewer productGroups={productGroups}/>
    </FlexCol>;
}

export default App;
