
import { download } from './dev/download-function';

console.log('Running dictionaries pre-processing script...')

// this file is included via webpack to dictionary pages; we're going from derecksnotes.com v1 to v2
// we need to clean up and pre-process the dictionaries
// we want to produce separate files per dictionary entry

// ------------------------
// Step 1: manual regex and clean up of text and tags
// ------------------------

// ------------------------
// Step 2: run this script and copy paste result back into into HTML file
// ------------------------
// const definitions: HTMLElement[] = Array.from(document.querySelectorAll(".definition"));

// const IDs: string[] = definitions.map(e => {
//     return(e.querySelector("a.definition-word").id)
// });

// const newIDs: string[] = definitions.map(e => {
//     let word: string = (e.querySelector("a.definition-word") as HTMLElement).innerText
//     word = word.toLowerCase()
//         .replace(/(\s)+/g, "_")
//         .replace(/\-|\//g, "_")
//         .replace(/\(|\)|\,|\.|\+|\'|\→/g, "")
//         .replace(/(_)+/g, "_");

//     return(word);
// });

// // getting the html with all the section dividers etc
// // since regex replace it's ok to do this no need for HTML structure
// let HTMLstring: string = document.querySelector("ol#dictionaryList").outerHTML;

// for (let i = 0; i < IDs.length; i++) {
//     const IDregex: RegExp = new RegExp(`id="${IDs[i]}"`, "g");
//     HTMLstring = HTMLstring.replace(IDregex, `id="${newIDs[i]}"`);

//     const hrefRegex: RegExp = new RegExp(`href="#${IDs[i]}"`, "g");
//     HTMLstring = HTMLstring.replace(hrefRegex, `href="#${newIDs[i]}"`);
// }

// download("dictionary.html", HTMLstring);

// ------------------------
// Step 3: run this code which will download each entry as a separate HTML file then we will add location and information to a database
// ------------------------
// const defintions: HTMLElement[] = Array.from(document.querySelectorAll("li.definition"));

// type Definition = {
//     word: string,
//     category: string,
//     html: string
// }

// const delay = (ms: number): Promise<void> => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     });
// }

// const definitionsJSON: Definition[] = [];

// (async () => {
//     for (let i = 0; i < defintions.length; i++) {
//         const name: string = defintions[i].querySelector("a.definition-word").id;
//         const data_category: string = defintions[i].getAttribute("data-dictionary");
//         const htmlString: string = defintions[i].innerHTML.toString().trim();
    
//         definitionsJSON[i] = {
//             word: name,
//             category: data_category,
//             html: htmlString
//         }
    
//         console.log(htmlString);
    
//         // run download(`${name}.html`, htmlString); every 5 seconds
//         await delay(10);
//         // download(`${name}.html`, htmlString);
//     }
// })();

// console.log(definitionsJSON);
