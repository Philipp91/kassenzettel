import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ImportApp, ParsingApp} from './App';

function render(content: React.ReactElement) {
    ReactDOM.render(
        <React.StrictMode>{content}</React.StrictMode>,
        document.getElementById('root')
    );
}

const isDevServer = document.location.protocol !== 'chrome-extension:';
if (window.location.hash === '#import' || isDevServer) {
    render(<ImportApp/>);
} else {
    render(<div>Loading...</div>);
    chrome.runtime.sendMessage({getCsv: true}, ({csvDatas}) => {
        if (csvDatas) {
            render(<ParsingApp csvDatas={csvDatas}/>);
        } else {
            render(<div>Es sind keine Daten (mehr) vorhanden. Bitte diese Seite schliessen.</div>);
        }
    });
}
