
// ------------------------
// add number to each figcaption text to count the number of images
const figcaptions: HTMLElement[] = Array.from(document.querySelectorAll("figcaption"));

// loop over every figcaption
for (let i = 0; i < figcaptions.length; i++) {
    // get the text of the figcaption
    const text: string = figcaptions[i].innerText;

    // if the text is not empty
    if (text !== "") {
        // add the number to the text
        figcaptions[i].innerText = `Figure ${i + 1}: ${text}`;
    }
}

// ------------------------
// lazy load images
const lazyloadImages: NodeListOf<Element> = document.querySelectorAll("img.lazy");
let lazyloadThrottleTimeout: undefined | ReturnType<typeof setTimeout>;

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
