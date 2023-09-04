---
title: "Markdown demo"
blurb: "Some subtitle"
coverImage: 24
author: "Dereck Mezquita"
date: 2020-09-03

tags: [first-category, second-category]
published: true
---

## Table of contents

You can directly have a paragraph here and it won't be scraped by `remark-toc`.

<!-- custom support for html including breaks -->
<br>

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

Internal link demonstration to [hierarchy in art](/blog/20181127_hierarchy-in-art).

External link demonstration to [google](https://www.google.com).

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |
| 1 | 2  |  3 |  4  |
| 5 | 6  |  7 |  8  |
| 9 | 10 | 11 | 12  |

## Tasklist

* [ ] to do
* [x] done

## Custom syntax

### Support for alerts

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

### Code syntax highlighting

```js
const someNewFunction = () => {
    return 2345234523;
}
```


```javascript
const test = 'test';

function test() {
    return 'test';
}
```

```r
someRfunction <- function() {
    return(2345234523)
}

library("R6")

TestClass <- R6Class(
    "TestClass",
    public = list(
        initialize = function(x) {
            self$x <- x
        },
        print_x = function() {
            print(self$x)
        }
    )
)
```