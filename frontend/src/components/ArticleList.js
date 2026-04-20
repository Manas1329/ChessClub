import React from 'react';
import ArticleCard from './ArticleCard';

export default function ArticleList({ articles, filter, onFilterChange }) {
  const articleTypes = Array.from(new Set((articles || []).map(article => (article.type || 'news').toLowerCase())));
  const filteredArticles = !filter || filter === 'all'
    ? articles
    : articles.filter(article => (article.type || 'news').toLowerCase() === filter);

  if (!articles || articles.length === 0) {
    return (
      <div className="artical-section">
        <h2 className="section-title">Latest News &amp; Events</h2>
        <p style={{ color: '#555', fontSize: '14px' }}>No articles yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="artical-section">
      <h2 className="section-title">Latest News &amp; Events</h2>
      <div className="article-filter-bar">
        <button
          type="button"
          className={`article-filter-chip${!filter || filter === 'all' ? ' active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        {articleTypes.map(type => (
          <button
            type="button"
            key={type}
            className={`article-filter-chip${filter === type ? ' active' : ''}`}
            onClick={() => onFilterChange(type)}
          >
            {type}
          </button>
        ))}
      </div>
      {filteredArticles.length === 0 ? (
        <p style={{ color: '#555', fontSize: '14px' }}>No articles match this tag.</p>
      ) : filteredArticles.map((article, i) => (
        <ArticleCard key={article._id} article={article} index={i} />
      ))}
    </div>
  );
}
