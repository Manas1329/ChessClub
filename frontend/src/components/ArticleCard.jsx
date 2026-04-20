import React from 'react';
import { assetUrl } from '../utils/api';

function resolveArticleImageUrl(imageUrl) {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return assetUrl(imageUrl);
}

export default function ArticleCard({ article, index }) {
  const isFeatured = article.featured || index === 0;

  // Format date from createdAt
  const dateStr = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : '';

  const meta = article.meta || (dateStr ? `${dateStr} • Club News` : '');
  const imageSrc = resolveArticleImageUrl(article.imageUrl);

  return (
    <article className={`article-card${isFeatured ? ' featured' : ''}`}>
      {imageSrc && (
        <div className="article-img-wrap">
          <img src={imageSrc} alt={article.title} />
        </div>
      )}
      <div className="article-content">
        <div className="article-header-row">
          <div className="article-tag">{article.type || 'news'}</div>
          {meta && <span className="article-meta">{meta}</span>}
        </div>
        <h3 className="article-title">{article.title}</h3>
        <p className="article-body">{article.body}</p>
        <a href="#" className="read-more">Read More →</a>
      </div>
    </article>
  );
}
