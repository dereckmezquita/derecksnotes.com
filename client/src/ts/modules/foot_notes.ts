
import crypto from 'crypto';

const footnotes: HTMLElement[] = Array.from(document.querySelectorAll(".foot-note"));

if (footnotes.length > 0) {
    const footNoteHolder: HTMLElement = document.createElement("ol");
    footNoteHolder.classList.add("foot-notes");

    const footNoteHeader: HTMLElement = document.createElement("div");
    footNoteHeader.classList.add("foot-notes-head");
    footNoteHeader.innerText = "Footnotes:";
    footNoteHeader.id = "foot-notes";
    footNoteHolder.appendChild(footNoteHeader);

    document.querySelector("article").appendChild(footNoteHolder);

    for (let i = 0; i < footnotes.length; i++) {
        const txt: string = footnotes[i].innerHTML;
        const hash: string = crypto.createHash("sha1").update(txt).digest("hex");

        footnotes[i].setAttribute("href", `#${hash}-down`);
        footnotes[i].id = `${hash}-up`;

        const refDown: HTMLElement = document.createElement("a");
        refDown.innerHTML = `[${i + 1}]`;
        refDown.style.textDecoration = "none";
        refDown.style.verticalAlign = "super";
        refDown.style.fontSize = "0.7em";
        refDown.setAttribute("href", `#${hash}-down`);
        footnotes[i].appendChild(refDown);

        const href: string = footnotes[i].getAttribute("data-href");
        footnotes[i].removeAttribute("data-href");

        const li: HTMLElement = document.createElement("li");
        li.id = `${hash}-down`;

        const a: HTMLAnchorElement = document.createElement("a");
        a.innerHTML = txt;
        a.href = href;
        a.target = "_blank";

        const refUp: HTMLAnchorElement = document.createElement("a");
        refUp.innerHTML = " ↑";
        refUp.style.textDecoration = "none";
        // refUp.style.verticalAlign = "super";
        refUp.style.fontSize = "1.5em";
        refUp.setAttribute("href", `#${hash}-up`);

        li.appendChild(a);
        li.appendChild(refUp); // todo jump up + some pixels to account for header
        document.querySelector(".foot-notes").appendChild(li);
    }
}
