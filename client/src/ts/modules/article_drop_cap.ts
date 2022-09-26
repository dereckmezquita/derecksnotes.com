
const firstParagraph: HTMLElement = document.querySelector("article > p");

const drop: HTMLElement = document.createElement("span");
drop.innerText = firstParagraph.innerText[0];
drop.setAttribute("class", "drop-cap");
// remove the first letter from the summary
firstParagraph.innerHTML = firstParagraph.innerHTML.slice(1);
// add the drop cap to the summary
firstParagraph.prepend(drop);

