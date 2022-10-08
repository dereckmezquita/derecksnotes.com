
import { getDefinitions } from "./request";

const dictionaryName: string = (document.getElementById("dictionary") as HTMLInputElement).value;

const definitionsDOM: HTMLElement = document.querySelector("#dictionary-list");

// get the definitions
(async () => {
    // loop through alphabet
    for (let i = 0; i < 26; i++) {
        const letter: string = String.fromCharCode(97 + i);
        const header: HTMLElement = document.createElement("h2");
        header.innerText = letter.toUpperCase();

        definitionsDOM.appendChild(header);

        // send query
        let res = await getDefinitions(dictionaryName, letter, 30);
        
        if (!res.success) throw new Error(res);

        const definitions: any[] = res.data.definitions;

        // console.log(res.data.nextToken);
        // while res.data.nextToken is not undefined then send query with nextToken
        while (res.data.nextToken) {
            res = await getDefinitions(dictionaryName, letter, 30, res.data.nextToken);
            definitions.push(...res.data.definitions);

            if (!res.success) throw new Error(res);
        }

        // loop through definitions
        for (const definition of definitions) {
            // create html from string
            // const parser = new DOMParser();
            // const html = parser.parseFromString(definition.html, 'text/html').body;
            const li = document.createElement("li");
            li.innerHTML = definition.html;

            definitionsDOM.appendChild(li);
        }
    }

    // query for all other symbols/numbers/letters
    const header: HTMLElement = document.createElement("h2");
    header.innerText = "#";
    definitionsDOM.appendChild(header);

    let res = await getDefinitions(dictionaryName, "#", 30);
    if (!res.success) throw new Error(res);

    const definitions: any[] = res.data.definitions;
    while (res.data.nextToken) {
        res = await getDefinitions(dictionaryName, "#", 30, res.data.nextToken);
        definitions.push(...res.data.definitions);

        if (!res.success) throw new Error(res);
    }

    // sort res.data.definitions which is an array, based on letter property
    definitions.sort((a: any, b: any) => {
        return a.letter > b.letter ? 1 : -1;
    });

    // loop through definitions
    for (const definition of definitions) {
        const li = document.createElement("li");
        li.innerHTML = definition.html;

        definitionsDOM.appendChild(li);
    }
})();
