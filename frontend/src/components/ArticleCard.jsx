import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../utils/api';

function resolveArticleImageUrl(imageUrl) {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return assetUrl(imageUrl);
}

function previewText(article) {
  const source = String(article.body || article.fullBody || '');
  const firstPara = source.split(/\n+/).find(Boolean) || source;
  if (firstPara.length <= 170) return firstPara;
  return `${firstPara.slice(0, 170).trim()}...`;
}

export default function ArticleCard({ article, index }) {
  const navigate = useNavigate();
  const isFeatured = article.featured || index === 0;

  // Format date from createdAt
  const dateStr = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : '';

  const meta = article.meta || (dateStr ? `${dateStr} • Club News` : '');
  const imageSrc = resolveArticleImageUrl(article.imageUrl);

  function handleReadMore(e) {
    e.preventDefault();
    const hasSession = !!(localStorage.getItem('adminToken') || localStorage.getItem('userToken'));
    if (hasSession) {
      navigate(`/articles/${article._id}`);
      return;
    }
    navigate('/login', { state: { redirectTo: `/articles/${article._id}` } });
  }

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
        <p className="article-body">{previewText(article)}</p>
        <a href={`/articles/${article._id}`} onClick={handleReadMore} className="read-more">Show More →</a>
      </div>
    </article>
  );
}
