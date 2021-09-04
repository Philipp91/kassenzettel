import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Demo, ParsingApp} from './App';

function render(content: React.ReactElement) {
    ReactDOM.render(
        <React.StrictMode>{content}</React.StrictMode>,
        document.getElementById('root')
    );
}

if (document.location.protocol === 'chrome-extension:') {
    render(<div>Loading...</div>);
    chrome.runtime.sendMessage({getCsv: true}, ({csvDatas}) => {
        if (csvDatas) {
            render(<ParsingApp csvDatas={csvDatas}/>);
        } else {
            render(<div>Es sind keine Daten (mehr) vorhanden. Bitte diese Seite schliessen.</div>);
        }
    });
} else { // Running in the React dev server
    render(<Demo/>);
}
