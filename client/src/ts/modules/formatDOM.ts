
// a set of promisified functions for formatting and loading the DOM for the client

// ------------------------
// ------------------------
export async function wordCount(): Promise<void> {
    const article: Element = document.querySelector("article");

    let test: string = article.textContent;
    // remove all new lines
    test = test.replace(/\n/g, " ");
    // remove all spaces that are more than one
    test = test.replace(/\s{2,}/g, " ");

    // count number of words
    const words: number = test.split(" ").length;

    // format words with commas for thousands places
    const wordsLength: string = words.toLocaleString();

    const upper_side_bar: Element = document.querySelector("#upper-side-bar");

    // create new p tag
    const word_count: HTMLElement = document.createElement("p");
    word_count.innerHTML = `Word count: ${wordsLength}`;
    word_count.classList.add("side-bar-stats");

    word_count.style.paddingTop = "7px";

    const time_to_read: HTMLElement = document.createElement("p");
    time_to_read.innerHTML = `Time to read: ${Math.round(words / 100)} minutes`;
    time_to_read.classList.add("side-bar-stats");

    time_to_read.style.paddingBottom = "10px";

    // append to side_bar_stats
    upper_side_bar.appendChild(word_count);
    upper_side_bar.appendChild(time_to_read);
}

// ------------------------
// ------------------------
export async function setTitle(): Promise<void> {
    const title: Element = document.querySelector("title");
    const h1: string = document.querySelector("h1").innerHTML;

    title.innerHTML = `Dn | ${h1}`;
}

// ------------------------
// ------------------------
import { createHash } from 'crypto';

export async function footNotes(): Promise<void> {
    // this script is included on articles/pages that potentially have footnotes
    // footnotes are written in the ejs/html file using the class="foot-note"

    // the author should include tags in their html as so:
    // <a class="foot-note" href="https://example.com">some text</a>
    // this text will be copied to a foot note and a link back and forth between these will be created

    const footnotes: HTMLElement[] = Array.from(document.querySelectorAll("a.foot-note"));

    // get all li elements found inside element of class extra-foot-notes; these are appended to the end of the generated footnotes
    const extraFootnotes: HTMLElement[] = Array.from(document.querySelectorAll(".extra-foot-notes li"));

    if (footnotes.length > 0) {
        // create the ordered list that gets appended to bottome of article
        const container: HTMLElement = document.createElement("ul");
        container.classList.add("foot-notes");

        const header: HTMLElement = document.createElement("div");
        header.classList.add("foot-notes-head");
        header.innerText = "FOOTNOTES:";
        header.id = "foot-notes";

        container.appendChild(header);

        document.querySelector("article").appendChild(container);

        for (let i = 0; i < footnotes.length; i++) {
            let footnote: HTMLElement = footnotes[i];
            // the user must use a tags with the following attributes
            // class="foot-note" and href="some-link"
            // these are processed and a footnote is created

            // get the original information from the footnote
            const href: string = footnote.getAttribute("href");
            const text: string = footnote.innerText;

            // create a hash from the text
            const hash: string = createHash("sha1").update(text).digest("hex");

            // ------------------------
            const in_line: HTMLElement = document.createElement("a");
            in_line.innerHTML = `<sup>[${i + 1}]</sup>`;
            in_line.style.textDecoration = "none";
            in_line.style.fontSize = "0.9em";

            // add link to down in_line
            in_line.setAttribute("href", `#${hash}-down`);
            in_line.id = `${hash}-up`;

            // replace the footnote element with the in-line element entirely
            footnote.parentNode.replaceChild(in_line, footnote);

            // ------------------------
            // create an li element into which the footnote will be placed
            const li: HTMLElement = document.createElement("li");
            // this allows the user to write foot notes with no links
            let out_of_line: HTMLElement;
            if (href) {
                out_of_line = document.createElement("a");
            } else {
                out_of_line = document.createElement("span");
            }

            // format the footnote link
            out_of_line.innerText = text;
            // if the href is null then the user did not provide a link
            if (href) out_of_line.setAttribute("href", href);
            out_of_line.setAttribute("target", "_blank");

            // add link from in_line
            out_of_line.setAttribute("id", `${hash}-down`);

            // create new number element for the footnote to link back up
            const out_of_line_tag: HTMLElement = document.createElement("a");
            out_of_line_tag.innerHTML = `<sup>[${i + 1}]</sup>`;
            out_of_line_tag.style.textDecoration = "none";
            out_of_line_tag.style.fontSize = "0.9em";

            // add the link back up to the footnote
            out_of_line_tag.setAttribute("href", `#${hash}-up`);

            // add the footnote to the li element
            li.appendChild(out_of_line);
            li.appendChild(out_of_line_tag);

            // add the li element to the container
            container.appendChild(li);
        }

        // append extra footnotes
        for (let i = 0; i < extraFootnotes.length; i++) {
            const extraFootnote: HTMLElement = extraFootnotes[i];
            extraFootnote.style.paddingTop = "5px";

            container.appendChild(extraFootnote);
        }
    }
}

// ------------------------
// ------------------------
export async function formatFigures(): Promise<void> {
    // this script is included on pages that have figures with the tags: figure, figcaption, img
    // it adds a number to the figcaption and lazy loads the images
    // this script should be run before the foot_notes script

    // ------------------------
    // add number to each figcaption text to count the number of images
    const figcaptions: HTMLElement[] = Array.from(document.querySelectorAll("figcaption"));

    if (figcaptions.length > 0) {
        // loop over every figcaption
        for (let i = 0; i < figcaptions.length; i++) {
            // get the text of the figcaption
            const text: string = figcaptions[i].innerHTML;

            // if the text is not empty
            if (text !== "") {
                // add the number to the text
                figcaptions[i].innerHTML = `Figure ${i + 1}: ${text}`;
            }
        }
    }


    // ------------------------
    // lazy load images
    const lazyloadImages: HTMLElement[] = Array.from(document.querySelectorAll("img.lazy"));

    if (lazyloadImages.length > 0) {
        let lazyloadThrottleTimeout: undefined | ReturnType<typeof setTimeout>;

        // load the first n images automatically
        const preLoad: number = 5;

        for (let i = 0; i < preLoad; i++) {
            if (lazyloadImages[i]) {
                // set the data-src to src
                lazyloadImages[i].setAttribute("src", lazyloadImages[i].getAttribute("data-src") as string);
                // remove data-src
                lazyloadImages[i].removeAttribute("data-src");
                // remove lazy class
                lazyloadImages[i].classList.remove("lazy");
                // remove class attrbitue
                lazyloadImages[i].removeAttribute("class");
            }
        }

        // remove the first n elements from the lazyloadImages array
        lazyloadImages.splice(0, preLoad);

        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(() => {
                let scrollTop: number = window.pageYOffset;

                lazyloadImages.forEach((img: any) => {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });

                if (lazyloadImages.length == 0) {
                    document.removeEventListener("scroll", lazyload);
                    window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }

    // ------------------------
    // display image large hovering over dom when clicked
    const images: HTMLElement[] = Array.from(document.querySelectorAll("article img"));

    if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            const image: HTMLImageElement = images[i] as HTMLImageElement;

            image.addEventListener("click", () => {
                const img: HTMLElement = document.createElement("img");
                img.setAttribute("src", image.src);
                img.setAttribute("class", "lightbox-image");

                document.body.appendChild(img);

                // if the user clicks on the lightbox image remove it
                img.addEventListener("click", () => {
                    img.remove();
                });
            });
        }
    }
}

// ------------------------
// ------------------------
export async function dropCap(): Promise<void> {
    const firstParagraph: HTMLElement = document.querySelector("article > p");

    const drop: HTMLElement = document.createElement("span");
    drop.innerText = firstParagraph.innerText[0];
    drop.setAttribute("class", "drop-cap");
    // remove the first letter from the summary
    firstParagraph.innerHTML = firstParagraph.innerHTML.trim().slice(1);
    // add the drop cap to the summary
    firstParagraph.prepend(drop);
}

// ------------------------
// ------------------------
import { getEntries } from "./request";

export async function getSideEntries(): Promise<void> {
    // get current url; this dicates what articles to request from database
    // const siteSection: string = window.location.href.split("/")[3];

    const siteSections: string[] = ["blog", "courses", "exercises", "tools"];

    // randomly select a site section
    let siteSection: string = siteSections[Math.floor(Math.random() * siteSections.length)];

    const entriesDOM: HTMLElement = document.querySelector(".side-entries");

    // get entries as a promise await
    const entries: any[] = [];

    console.log(entries);

    // loop through entries and create a card for each
    for (const entry of entries) {
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
}
