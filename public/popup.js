const container = document.getElementById('instructions');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const goButton = document.getElementById('go');

function dateToString(date) {
    return date.toISOString().substr(0, 10);
}

async function init() {
    const activeTabs = await chrome.tabs.query({active: true, currentWindow: true});
    if (activeTabs.length !== 1) {
        container.innerText = 'Aktueller Tab konnte nicht erkannt werden.';
        return;
    }

    const activeTab = activeTabs[0];
    const expectedUrl = 'https://www.migros.ch/de/cumulus/konto/kassenbons.html';
    if (!activeTab.url.startsWith(expectedUrl) || !activeTab.id) {
        console.log('Wrong URL', activeTab.url);
        container.innerHTML = `Bitte auf die <a href="${expectedUrl}" target="_blank">Kassenbons-Seite</a> navigieren.`;
        return;
    }

    // Migros allows at most 2 years back.
    fromDate.min = toDate.min = dateToString(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 2));
    fromDate.max = toDate.max = dateToString(new Date());
    // The default period is the last 365 days (even in gap years, for better comparability with other years).
    fromDate.value = dateToString(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 364));
    toDate.value = dateToString(new Date());

    goButton.tabId = activeTab.id;
    goButton.style.display = 'initial';
}

init().catch(console.error);

goButton.onclick = async () => {
    if (fromDate.value < fromDate.min || toDate.value < toDate.min) {
        container.innerHTML = `Datum muss nach ${fromDate.min} sein.`;
        return;
    }
    if (fromDate.value > fromDate.max || toDate.value > toDate.max) {
        container.innerHTML = `Datum muss vor ${fromDate.min} sein.`;
        return;
    }

    goButton.disabled = true;
    goButton.innerText = 'Moment bitte...';
    chrome.runtime.onMessage.addListener(({progress}) => {
        if (!progress) return;
        if (progress === 'done') {
            goButton.innerText = 'Kassenzettel analysieren';
            goButton.disabled = false;
        } else {
            goButton.innerText = `${progress} Seiten geladen...`;
        }
    });
    chrome.scripting.executeScript({
        target: {tabId: goButton.tabId},
        files: ['content.js'],
    }, () => {
        chrome.tabs.sendMessage(goButton.tabId, {
            fromDate: fromDate.value,
            toDate: toDate.value,
        });
    });
};
