export function download(downloadContent: string, mimeType: string, filename: string) {
    const blob = new Blob([downloadContent], {type: mimeType});
    const url = URL.createObjectURL(blob);
    if (document.location.protocol === 'chrome-extension:') {
        chrome.downloads.download({url, filename});
    } else {
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = url;
        tempLink.setAttribute('download', filename);
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }

    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        URL.revokeObjectURL(url);
    }, 100);
}

export function downloadJson(data: unknown, filename: string) {
    download(JSON.stringify(data), 'application/json', filename);
}
