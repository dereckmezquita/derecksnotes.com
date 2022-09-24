
// this script is included on articles/pages that potentially have footnotes
// footnotes are written in the ejs/html file using the class="foot-note"

// the author should include tags in their html as so:
// <a class="foot-note" href="https://example.com">some text</a>
// this text will be copied to a foot note and a link back and forth between these will be created

import { createHash } from 'crypto';

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
