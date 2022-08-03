
const article: Element = document.querySelector("article");

let test: string = article.textContent;
// remove all new lines
test = test.replace(/\n/g, " ");
// remove all spaces that are more than one
test = test.replace(/\s{2,}/g, " ");

// count number of words
const words: number = test.split(" ").length;

const side_bar_stats: Element = document.querySelector("#side-bar-stats");

// create new p tag
const word_count: Element = document.createElement("p");
word_count.innerHTML = `Word count: ${words}`;

const time_to_read: Element = document.createElement("p");
time_to_read.innerHTML = `Time to read: ${Math.round(words / 200)} minutes`;

// append to side_bar_stats
side_bar_stats.appendChild(word_count);
side_bar_stats.appendChild(time_to_read);
