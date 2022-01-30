let lastData = null;
chrome.runtime.onMessage.addListener(({csvDatas, getCsv}, sender, sendResponse) => {
    if (Array.isArray(csvDatas)) {
        lastData = csvDatas;
        // noinspection JSIgnoredPromiseFromCall
        chrome.tabs.create({url: 'index.html'});
    } else if (getCsv) {
        sendResponse({csvDatas: lastData});
    }
});
