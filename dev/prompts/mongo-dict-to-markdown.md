I have a json file that looks like this:

```json
[
    {
        "_id": {
            "$oid": "6352159f0774c21f8f229be3"
        },
        "dictionary": "biology",
        "category": "ecology",
        "dataSource": "original-dereck",
        "letter": "a",
        "identifier": "absorbance",
        "linksTo": [
            "ingestion"
        ],
        "linkedFrom": [
            "plate_reader"
        ],
        "html": "<a class=\"definition-word\" id=\"absorbance\">Absorbance</a> - To take in, or ingest water and or dissolved minerals across a cell membrane. Different from <a href=\"#ingestion\">ingestion</a>."
    },
    {
        "_id": {
            "$oid": "6352159f0774c21f8f229d28"
        },
        "dictionary": "biology",
        "category": "ecology",
        "dataSource": "berkeley",
        "letter": "i",
        "identifier": "ingestion",
        "linksTo": [],
        "linkedFrom": [
            "absorbance"
        ],
        "html": "<a class=\"definition-word\" id=\"ingestion\">Ingestion</a> - The intake of water or food particles by \"swallowing\" them, taking them into the body cavity or into a vacuole. Contrast with absorption."
    }
]
```

I want you to write some code that will convert this into a markdown document and write each one to a separate file.

Each entry should have a YAML that looks as such:


```markdown
---
word: absorbance
letter: a

category: ecology
dataSource: original-dereck
dictionary: biology
date: 2023-09-09

tags: [ingestion, cell-biology]
published: true
comments: true
---

To take in, or ingest water and or dissolved minerals across a cell membrane. Different from [ingestion](#ingestion).
```