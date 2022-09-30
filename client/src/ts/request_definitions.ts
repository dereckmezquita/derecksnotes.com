
import { getDefinitions, getEntries } from "./modules/request";

const dictionaryKind: string = (document.getElementById("dictionary") as HTMLInputElement).value;

console.log(dictionaryKind)


const definitionsDOM: HTMLElement = document.querySelector("#dictionary-list");

// get the definitions
(async () => {
    const res = await getDefinitions(dictionaryKind, 10);
    // const res = await getEntries("blog", 10);

    if (!res.success) throw new Error(res);
    console.log(res);
})();