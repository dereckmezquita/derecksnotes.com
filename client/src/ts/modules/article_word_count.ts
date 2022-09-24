
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
time_to_read.innerHTML = `Time to read: ${Math.round(words / 200)} minutes`;
time_to_read.classList.add("side-bar-stats");

time_to_read.style.paddingBottom = "10px";

// append to side_bar_stats
upper_side_bar.appendChild(word_count);
upper_side_bar.appendChild(time_to_read);
