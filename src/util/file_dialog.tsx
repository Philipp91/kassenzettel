export async function showFileDialog(
    accept: string = '*'
): Promise<File> {
    return new Promise<File>(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.onchange = (event: Event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length) {
                resolve(files[0]);
            }
        };
        input.click();
    });
}
