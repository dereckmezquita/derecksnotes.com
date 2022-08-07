
// https://stackoverflow.com/questions/45831191/generate-and-download-file-from-js

export function download(filename: string, text: string): void {
    const element = document.createElement("a");

    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
