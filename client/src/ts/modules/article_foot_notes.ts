
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
    const container: HTMLElement = document.createElement("ol");
    container.classList.add("foot-notes");

    const header: HTMLElement = document.createElement("div");
    header.classList.add("foot-notes-head");
    header.innerText = "FOOTNOTES:";
    header.id = "foot-notes";
    header.style.fontSize = "14px";
    header.style.marginBottom = "7px";
    header.style.marginLeft = "-35px";

    container.appendChild(header);

    document.querySelector("article").appendChild(container);

    // loop through all footnotes
    for (let i = 0; i < footnotes.length; i++) {
        let footnote: HTMLElement = footnotes[i];
        // the user must use a tags with the following attributes
        // class="foot-note" and href="some-link"
        // these are processed and a footnote is created

        // catching authors error; add target="_blank"
        footnote.setAttribute("target", "_blank");

        // get the text of the footnote
        const text: string = footnote.innerText;
        
        // create a hash from the text
        const hash: string = createHash("sha1").update(text).digest("hex");

        // create a numbered reference that goes inline with the text
        const inlineRef: HTMLElement = document.createElement("a");
        inlineRef.innerHTML = `[${i + 1}]`;
        inlineRef.style.textDecoration = "none";
        inlineRef.style.verticalAlign = "super";
        inlineRef.style.fontSize = "0.7em";

        // this element links to the footnote below and has an id that is used to link back up
        inlineRef.setAttribute("href", `#${hash}-down`);
        inlineRef.id = `${hash}-up`;
        footnote.appendChild(inlineRef);

        // create the footnote; these are appended to the end the container element we created above
        // first create list element then a tag which does the linking; goes inside li
        const endRef: HTMLElement = document.createElement("li");
        const endRefLink: HTMLAnchorElement = document.createElement("a");
        endRefLink.innerHTML = text;

        // create element that links back up to the inline reference
        const backUp: HTMLAnchorElement = document.createElement("a");
        backUp.innerHTML = " ↑";
        backUp.style.textDecoration = "none";
        // backUp.style.fontSize = "1em";
        backUp.style.verticalAlign = "super";
        backUp.setAttribute("href", `#${hash}-up`);

        // set the href of the a tag to the href attribute of the original footnote
        endRefLink.setAttribute("href", footnote.getAttribute("href"));
        // target blank
        endRefLink.setAttribute("target", "_blank");

        // set the id of the li element to the hash we created
        endRefLink.setAttribute("id", `${hash}-down`);

        // append the link to the list element
        endRef.appendChild(endRefLink);
        // append the back up tag
        endRef.appendChild(backUp);
        // append the list element to the container
        container.appendChild(endRef);
    }

    // append extra footnotes
    for (let i = 0; i < extraFootnotes.length; i++) {
        const extraFootnote: HTMLElement = extraFootnotes[i];
        extraFootnote.style.paddingTop = "5px";

        container.appendChild(extraFootnote);
    }
}
