# Writing voice — Dereck Mezquita

A reference profile of the author's voice, distilled from a close-reading of authentic posts. Used as a guide when AI assistance is involved in drafting, so the result still sounds like Dereck.

This document is for the maintainer; it is not published on the site.

---

## Headline

A scientifically-trained, British-English-using essayist who treats the blog as a thinking surface, not a finished product. Declarative and unhedged on facts; openly opinionated on aesthetic and ethical questions. Reaches for a slightly elevated literary register without lapsing into ornament. Walks the reader through ideas in **first-person plural** ("we'll delve into…"), pairs concepts with code or formulas, and ends abruptly — on the last code block, an open question, or a "note to self" — never on a tidy wrap-up.

## Persona

A working scientist-engineer (bioinformatics / R / JS / maths) with an essayistic streak. Reads Feynman and the British essayists. Distrusts authority on principle. Treats writing as note-taking for himself first, audience second.

## Sentence shape

Medium-length declarative sentences, typically 15-30 words, with one or two comma-separated clauses and a tendency toward triadic lists ("the syntax is clean, the mental model is clear, and it handles concurrent operations gracefully"). Sentences open with a framing clause ("In this guide, we...", "In R...", "Programmatically, we...", "I had an interesting..."), then commit to a main clause, often closing on a participial tag-on ("illustrating not just...", "reflecting the fractal principle..."). Short 6-15-word openers are common in personal/reflective posts; longer hypotactic sentences appear in technical exposition. Semicolons are rare; commas and colons carry the load. Fragments are not used.

## Paragraph shape

Paragraphs are short and load-bearing. Technical posts follow a tight micro-pattern: name the concept (bold on first mention), give one or two sentences of intuition, present the formula or code, then a single closing sentence that observes what just happened ("The perimeter grows without bound, yet the area converges"). Reflective posts open with a personal trigger (a video, a conversation, a documentary), pivot to the idea in a paragraph or two, and stop. There is no concluding paragraph, no summary, no call to action — the post ends on the last code block, the last formula, or an open question.

## Vocabulary signature

- "we'll walk through" / "we'll delve into" / "we'll discuss" as scope-setters
- "Programmatically, we…" as the bridge from concept to code
- "In this guide/article, we…" opener
- "interesting" as the default trigger adjective ("an interesting conversation", "interesting documentary")
- "I remain sceptical / unimpressed / unconvinced" for stating a steady opinion
- "of course" as inline concession ("This is of course me paraphrasing")
- "in fact", "however", "moreover", "indeed" as connective tissue
- "simply" as softener for strong claims
- "one" as impersonal essayistic pronoun ("one must first demonstrate mastery")
- "Note to self" / "Lesson learned" / "The insight was the following" as meta-labels
- "I'm paraphrasing of course" as a near-tic after reported speech
- Latinate reaches when editorialising: *ameliorate*, *banality*, *fantastical*, *indelible*, *irreverent*, *exuberance*, *permeates*
- Decorative descriptors for maths: *captivating*, *stunning*, *remarkable*, *beautiful*
- Hedging only on opinion or future plans: "I suppose", "it seems", "might be", "I believe"
- "e.g.," for examples (not "i.e." or "for example")

## Structural moves

- Frontmatter `blurb` is a short evocative or colloquial tagline often unrelated to the body ("Blood marriage in blue", "Classical art still kicks ass!", "We're all dust anyway", "Moths recite the spreadsheet.")
- First non-frontmatter line is either a scope statement ("In this guide, we'll walk through…") or a personal trigger ("I had an interesting conversation with Guy the other day")
- H2 noun-phrase headings, sometimes with a colon and a descriptive subtitle ("The Golden Spiral: A Visualisation of the Divine Proportion"); numbered H2/H3 in tutorial-style posts
- Numbered lists written as `1. … 1. … 1.` (relying on markdown to renumber), used as the argumentative spine
- Bold the named object/term on first mention; inline backticks for paths, packages, functions, CLI tools
- Concept → formula in display LaTeX → prose explanation of symbols → implementation paragraph
- In ops/tutorial posts: imperative sentence → optional one-line justification → fenced code block with teaching comments inline
- Reflective posts cite a YouTube `<iframe>` or `<Blockquote src='…'>` as primary source
- Posts end abruptly: last code block, last formula, an open question, or a "note to self" — no sign-off, no summary

## Rhetorical devices

- Personal-trigger openings — anchor an abstract topic in a concrete recent experience (a conversation, a video, a documentary)
- First-person plural "we" to walk the reader through technical steps; first-person singular "I" only when stating an opinion or admitting uncertainty
- Open editorialising on aesthetic and ethical questions ("I remain sceptical of…", "I believe one must first…") — does not pretend to neutrality
- Humility markers when borrowing ideas: "I'm paraphrasing of course", "This is of course me paraphrasing", "I will have to reflect further upon this"
- Triadic lists as default rhythm (three nouns, three clauses)
- Parenthetical "e.g.," glosses; occasional "(Note: …)" for pitfalls in tutorials
- Open-question or "note to self" closer in personal posts; punchy aphoristic observation closer in technical sections
- Footnote citations `[^1]` even on short personal posts
- Distrust-of-authority framing as a recurring identity move ("do not trust any authority… This is what it means to be a scientist")

## Spelling and conventions

British/Oxford English throughout: *sceptical, favour, behaviour, organised, realise, recognise, characterise, colonise, humour, signalling, prioritise, optimise, specialised, normalisation, visualisation, characterisation, modelling, standardisation*. Acronyms in technical bullets are often lowercased inside running prose (rna-seq, gc content, gsea, vcf, bam) even when the bolded heading uses canonical casing.

**No em-dashes (U+2014).** Use commas, colons, and full stops; semicolons sparingly. Contractions limited to the common forms ("we'll", "you're", "we've", "I'd"). No emoji. Inline backticks for code; bold for first mention of named objects; LaTeX in display math.

## Forbidden patterns

- Em-dashes (`—`) anywhere — use commas, colons, or full stops instead
- AI-flavoured openers and connectives: *"let's dive in"*, *"let's explore"*, *"in today's fast-paced world"*, *"it's worth noting that"*, *"in conclusion"*
- Marketing adjectives: *amazing, incredible, powerful, seamless, game-changing, cutting-edge*
- Tidy wrap-up paragraphs, sign-offs, or calls to action ("Hope this helps", "Happy hacking", "Let me know in the comments", "Subscribe")
- Rhetorical questions to the reader ("Ever wondered…?", "So what does this mean?") and casual interjections ("Heads up", "Quick aside", "Fun fact")
- American spellings (*normalization, visualization, behavior, skeptical, favor, recognize*) and Title-Casing of section headings beyond what he actually does
- Hedging filler on technical claims ("sort of", "kind of", "basically", "literally") — hedging is reserved for opinion only
- Headings phrased as questions ("What is a fractal?") or as rhetorical hooks; headings are noun phrases or numbered descriptors
- Pretending neutrality on aesthetic or ethical questions; the writer names his stance plainly

## Sample phrasings — canon to mirror

Verbatim quotes from his actual posts. These are the touchstones.

- *"In this guide, we'll walk through the process of setting up a mail server on a Linode server, which includes configuring DNS records, installing Postfix and OpenDKIM, and ensuring your server can send emails successfully."*
- *"We'll delve into the mathematics behind golden spirals, fractal sets, and parametric curves."*
- *"Along the way, we'll discuss the programming strategies that implement these visualisations and show how combining mathematics with code can produce stunning results."*
- *"Programmatically, we step through angles, compute radii, and trace out the spiral on the canvas."*
- *"The perimeter grows without bound, yet the area converges."*
- *"Despite the randomness, the points converge into a realistic fern shape."*
- *"A compilation of tools, methodologies, workflows and resources for bioinformatics analysis. This is meant to be a quick reference sheet and not comprehensive."*
- *"In R, while asynchronous programming isn't built into the language core, we can achieve similar elegance by combining the promises, later, and coro packages."*
- *"As you see, the R version mirrors the JavaScript version in structure by using `$then()` and `$catch()`."*
- *"Even so, I remain sceptical of modern art that disregards technical skill in favour of so called conceptual depth."*
- *"Lesson learned; do not trust any authority, and always question everything. This is what it means to be a scientist."*
- *"It seems that at some point, and at some level I will have to trust some authorities… which ones?"*

---

## Methodology

Generated 2026-06-18 from a close-reading of these 11 files:

- `client/src/app/blog/posts/20180624_earth-biogenome-project.mdx`
- `client/src/app/blog/posts/20181127_hierarchy-in-art.mdx`
- `client/src/app/blog/posts/20181204_on-the-meaning-of-life.mdx`
- `client/src/app/blog/posts/20181217_on-authority.mdx`
- `client/src/app/blog/posts/20190405_japanese-archery-and-focus.mdx`
- `client/src/app/blog/posts/20231117_how-to-send-e-mail-from-node.mdx`
- `client/src/app/blog/posts/20241214_new-blog-feature-canvases.mdx`
- `client/src/app/blog/posts/20241220_bioinformatics-cheat-sheet.mdx`
- `client/src/app/blog/posts/20250208_async-programming-in-R-for-JS-devs.mdx`
- `client/src/app/dictionaries/biology/definitions/biology_general-biology_e_e-coli-escherichia-coli-k12-strain.mdx`
- `client/src/app/dictionaries/chemistry/definitions/chemistry_general-chemistry_a_alkoxide.mdx`
- `client/src/app/references/posts/biography_richard-feynman.mdx`

Deliberately **excluded**: `20260405_a-portrait-of-the-author.mdx` (Claude-assisted, would have reflected previously-imitated voice rather than authentic voice) and `20241213_on_consciousness.mdx` (suspicious em-dash density suggesting Claude polishing).

Three independent readers each took a subset, characterised the voice from their excerpts with verbatim evidence, and a synthesiser merged their observations — preferring patterns observed by multiple readers and discarding low-confidence single-reader claims.

Update this document by re-running the same workflow when new posts shift the voice meaningfully.
