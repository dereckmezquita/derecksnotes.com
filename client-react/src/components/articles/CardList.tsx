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