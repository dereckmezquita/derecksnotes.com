
Hello ChatGPT,

I have a website that is built using React. So far this is what I have:

index.tsx:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
```

App.tsx:
```tsx
import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

import Head from './components/page-parts/Head';
import InfoBar from './components/page-parts/InfoBar';
import Header from './components/page-parts/Header';
import Nav from './components/page-parts/Nav';
import Footer from './components/page-parts/Footer';
import CardList from './components/articles/CardList';

import { GlobalStyle } from './styles/GlobalStyle.styles';

const PageContainer = styled.div`
    /* Add any global styles */
`;

const Wrapper = styled.div`
    /* Add styles for .wrapper */
`;

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <PageContainer>
                <Head />
                <InfoBar />
                <Header />
                <Nav />
                <Wrapper>
                    <CardList siteSection="blog" />
                </Wrapper>
                <Footer />
            </PageContainer>
        </ThemeProvider>
    );
};

export default App;
```

As you can see it is a single page and it is a work in progress. I am still learning React so please bear with me. You are to act as the teacher and instructor. Guide me in this process please and correct any of my mistakes or misunderstandings - let me know if I am not following convention as well - I would like to follow convention.

What I want now is to make my website multi-paged.

I want it to have this structure:

- /
- /blog
- /blog/some-blog-post

I have the metadata stored in a MongoDB database for the blog posts; this is the information I have for each one:

```typescript
type ArticleMetadata = {
    siteSection: string,
    subSection: null | string,
    fileName: string,
    author: string,
    articleTitle: string,
    image: number,
    slogan: string,
    summary: string,
    categories: string[],
    published: boolean,
    date: Date | string,
    commentsOn: boolean
}
```

So far I am using this for the index page to load links to the different pages of the website:

Card.tsx
```tsx
import React from 'react';

interface CardProps {
    data: ArticleMetadata;
}

const Card: React.FC<CardProps> = ({ data }) => {
    // format as: YYYY-MM-DD
    const date: string = new Date(data.date).toISOString().substring(0, 10);

    return (
        <a className="card" href={`/${data.siteSection}/${data.fileName}`}>
            <div className="entry-data entry-slogan">{data.slogan}</div>
            <div className="entry-data entry-name">{data.articleTitle}</div>
            <img className="entry-img" src={`/site-images/card-covers/${data.image}.png`} alt={data.articleTitle} />
            <div className="entry-data entry-author">{data.author}</div>
            {data.summary && (
                <div className="entry-data entry-summary">
                    <span className="drop-cap">{data.summary[0]}</span>
                    <span className="summary-text">{data.summary.slice(1, 151).replace(/\.$|\,$/, '').trim()}...</span>
                    <span className="entry-data entry-date">{date}</span>
                </div>
            )}
        </a>
    );
};

export default Card;
```

CardList.tsx
```tsx
import React, { useEffect, useState } from 'react';
import Card from './Card';
import { reqArticles } from '../../modules/request';

interface CardListProps {
    siteSection: string;
}

const CardList: React.FC<CardListProps> = ({ siteSection }: CardListProps) => {
    const [cards, setCards] = useState<ArticleMetadata[]>([]);

    useEffect(() => {
        async function fetchCards() {
            // Fetch the data and update the state
            const fetchedCards = await getCards(siteSection);
            setCards(fetchedCards);
        }

        fetchCards();
    }, [siteSection]);

    return (
        <div className="card-articles">
            {cards.map((card) => (
                <Card key={card.fileName} data={card} />
            ))}
        </div>
    );
};

async function getCards(siteSection: string): Promise<ArticleMetadata[]> {
    let res = await reqArticles(siteSection, 20);
    if (!res.success) throw new Error(res.error);

    const articles: ArticleMetadata[] = res.data.articles;

    while (res.data.nextToken) {
        res = await reqArticles(siteSection, 30, res.data.nextToken);
        articles.push(...res.data.articles);

        if (!res.success) throw new Error(res.error);
    }

    // Reorder articles by date
    articles.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateB.getTime() - dateA.getTime();
    });

    return articles;
}

export default CardList;
```

What I need your help with now is this: guide me! Please guide me. I am lost and don't know how to proceed. I suspect what I need is `react-router-dom`. I've seen that this would allow me to route to different pages.

What I want is to be able to write a blog post in `tsx` syntax with the content. I like being able to write my blog posts in `tsx`/`html` as this allows me the freedom to use markup language and even style certain pages differently very easily.

I want for my `App.tsx` to read what files are stored in my `blog/` directory and create links to those pages using `react-router-dom` so I can have a multi-page website.

Is this the right way to do things? Can you start by either validating what I want or suggesting a different approach? Again I am lost here and am looking to you for guidance.