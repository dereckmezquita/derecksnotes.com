
import { download } from './modules/download-function';

const definitions: HTMLElement[] = Array.from(document.querySelectorAll(".definition"));

const IDs: string[] = definitions.map(e => {
    return(e.querySelector("a.definition-word").id)
});

const newIDs: string[] = definitions.map(e => {
    let word: string = (e.querySelector("a.definition-word") as HTMLElement).innerText
    word = word.toLowerCase()
        .replace(/(\s)+/g, "_")
        .replace(/\-|\//g, "_")
        .replace(/\(|\)|\,|\.|\+|\'|\→/g, "")
        .replace(/(_)+/g, "_");

    return(word);
});

// getting the html with all the section dividers etc
// since regex replace it's ok to do this no need for HTML structure
let HTMLstring: string = document.querySelector("ol#dictionaryList").outerHTML;

for (let i = 0; i < IDs.length; i++) {
    const IDregex: RegExp = new RegExp(`id="${IDs[i]}"`, "g");
    HTMLstring = HTMLstring.replace(IDregex, `id="${newIDs[i]}"`);

    const hrefRegex: RegExp = new RegExp(`href="#${IDs[i]}"`, "g");
    HTMLstring = HTMLstring.replace(hrefRegex, `href="#${newIDs[i]}"`);
}

download("dictionary.html", HTMLstring);
