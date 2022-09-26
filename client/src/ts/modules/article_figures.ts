
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
