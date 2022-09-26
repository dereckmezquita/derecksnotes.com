
import { getEntries } from "./request";

// get current url; this dicates what articles to request from database
const siteSection: string = window.location.href.split("/")[3];

const entriesDOM: HTMLElement = document.querySelector(".side-entries");

// get entries as a promise await
(async () => {
    const res = await getEntries(siteSection, 10);

    if (!res.success) throw new Error(res);

    // loop through entries and create a card for each
    for (const entry of res.data.entries) {
        const list: HTMLElement = document.createElement("li");
        entriesDOM.appendChild(list);

        // create the a tag which links to the article
        const link: HTMLElement = document.createElement("a");
        link.setAttribute("class", "side-link");
        link.setAttribute("href", `/${siteSection}/` + entry.fileName);
        link.innerText = entry.articleTitle;
        list.appendChild(link);

        // set the date
        const date: HTMLElement = document.createElement("span");
        date.setAttribute("class", "side-date");
        // extract year month day from iso date; "2021-07-30T05:00:00.000Z"
        const year: string = entry.date.slice(0, 4);
        const month: string = entry.date.slice(5, 7);
        const day: string = entry.date.slice(8, 10);
        date.innerText = `${month}/${day}/${year}: `;
        link.prepend(date);
    }
})();
