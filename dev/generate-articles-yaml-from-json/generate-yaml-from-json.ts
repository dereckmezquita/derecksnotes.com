// read json file called articles_metadata.json sync

import fs from 'fs';
import path from 'path';

const articlesMetadata = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles_metadata.json'), 'utf8'));

console.log(articlesMetadata);

// our goal is to generate this string into a single file called articles.yaml
// ---
// title: "An Introduction to DigiByte"
// blurb: "Grab the legs by the world!"
// coverImage: 114
// author: "Dereck Mezquita"
// date: 2020-09-03

// tags: [first-category, second-category]
// published: true
// ---

const yamls: string[] = [];

// date in json is formatted as "2016-12-16T00:00:00Z"
// we need to convert it to a date object

for (const article of articlesMetadata) {
    const date: string = new Date(article.date.$date).toISOString().slice(0, 10);

    const yaml = `---
title: "${article.articleTitle}"
blurb: "${article.slogan}"
coverImage: ${article.image}
author: "${article.author.replace(/de Mezquita/, 'Mezquita')}"
date: ${date}

tags: [${article.categories.join(', ')}]
published: ${article.published}
comments: ${article.commentsOn}
---`;

    yamls.push(yaml);
}

fs.writeFileSync(path.join(__dirname, 'articles.yaml'), yamls.join('\n\n\n'));