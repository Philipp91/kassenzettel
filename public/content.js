async function fetchHistoricalBonsPage(url) {
    const mainResponse = await fetch(url);
    const mainPage = await mainResponse.text();

    const formData = new FormData();
    formData.set("language", "de");
    formData.set("details", "true");
    for (const match of mainPage.matchAll(/<input name="(checkbox[0-9]+)" value="([0-9_]+)" type="hidden">/g)) {
        formData.set(match[1], match[2]);
    }
    const csvResponse = await fetch('https://www.migros.ch/service/avantaReceiptExport/csv.csv', {
        method: 'post',
        body: formData
    });
    const csvData = await csvResponse.text();

    const nextPageMatch = mainPage.match(/<a [^>]*href="(\/de\/cumulus\/konto\/kassenbons\.html\?[^"]*)" [^>]*rel="next"/);
    return [csvData, nextPageMatch ? 'https://www.migros.ch' + nextPageMatch[1].replaceAll('&amp;', '&') : null];
}

async function fetchAllHistoricalBons(fromDate, toDate) {
    let url = `https://www.migros.ch/de/cumulus/konto/kassenbons.html?period=${fromDate}_${toDate}`;
    let csvData;
    const csvDatas = [];
    while (url) {
        console.log('Loading', url);
        [csvData, url] = await fetchHistoricalBonsPage(url);
        csvDatas.push(csvData);
        chrome.runtime.sendMessage({progress: csvDatas.length});
    }
    chrome.runtime.sendMessage({progress: 'done', csvDatas});
}

if (!chrome.runtime.onMessage.hasListeners()) {
    chrome.runtime.onMessage.addListener(async ({fromDate, toDate}) => {
        if (fromDate.length === 10 && toDate.length === 10) {
            console.log(`Executing fetch from ${fromDate} to ${toDate}`);
            await fetchAllHistoricalBons(fromDate, toDate);
        }
    });
}