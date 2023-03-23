import React from 'react';

const Card: React.FC<ArticleMetadata> = (data) => {
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
