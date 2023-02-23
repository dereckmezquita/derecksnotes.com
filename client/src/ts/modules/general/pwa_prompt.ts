// TODO: refactor to be class based
// Set the cache to save user's choice
const getPromptCache = localStorage.getItem("promptToggle");

// check if device is mobile or desktop
const mobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
// check if the device is an ipad
const isIpad: boolean = /iPad/i.test(navigator.userAgent);

window.addEventListener("load", function() {
    // Check if PWA is installed or not
    const installed = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone ? true : false;

    if(getPromptCache !== "off" && mobile && !installed) {
        createPrompt();
    }
})


function createPrompt() {
    const body: HTMLBodyElement = document.querySelector("body");

    const pwaPrompt: HTMLDivElement = document.createElement("div");
    pwaPrompt.setAttribute("class", "pwa-prompt-container");

    // add the pwaClicked function to the pwaPrompt
    pwaPrompt.addEventListener("click", pwaClicked);

    const pwaBubbleElem: HTMLDivElement = document.createElement("div");
    pwaBubbleElem.setAttribute("class", "pwa-bubble");
    pwaPrompt.appendChild(pwaBubbleElem);

    const pwaPlusCont: HTMLDivElement = document.createElement("div");
    pwaPlusCont.setAttribute("id", "pwa-plus-container");
    // pwaPlusCont.setAttribute("class", "promptPwa");
    pwaBubbleElem.appendChild(pwaPlusCont);

    const pwaPlusBtn: HTMLImageElement = document.createElement("img");
    pwaPlusBtn.setAttribute("src", "/site-images/pwa-icons/apple-plus.png");
    pwaPlusBtn.setAttribute("class", "pwa-plus-icon");
    pwaPlusCont.appendChild(pwaPlusBtn);

    const pwaTxt: HTMLDivElement = document.createElement("div");
    // pwaTxt.setAttribute("id", "pwaTxtCont");
    // pwaTxt.setAttribute("class", "promptPwa");
    pwaTxt.innerHTML = "Install this WebApp: tap <img src=\"/site-images/pwa-icons/apple-share-blue.png\" class=\"pwa-action-icon\"> and then Add to Home Screen. Touch window to hide."
    pwaBubbleElem.appendChild(pwaTxt);

    if(isIpad) {
        pwaPrompt.style.width = "350px";
        const width = screen.availWidth;

        if(width < 400) {
            pwaPrompt.style.width = "200px";
        }

        pwaPrompt.style.top = "45px";
        pwaPrompt.style.right = "15px";
    }

    body.appendChild(pwaPrompt);
}

function removePwaPrompt() {
    const pwaPrompt: HTMLDivElement = document.querySelector(".pwa-bubble");
    pwaPrompt.parentNode.removeChild(pwaPrompt);
}

// User action removal of prompt
function pwaClicked() {
    removePwaPrompt();
    localStorage.setItem("promptToggle", "off");
}
