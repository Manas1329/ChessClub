import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/homepage.css';
import '../styles/extraPages.css';
import { apiUrl, assetUrl, getAuthToken } from '../utils/api';

function articleImage(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return assetUrl(url);
}

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const token = getAuthToken();
      if (!token) {
        navigate('/login', { state: { redirectTo: `/articles/${id}` } });
        return;
      }

      setLoading(true);
      setError('');

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [aRes, rRes] = await Promise.all([
          fetch(apiUrl(`/articles/${id}/full`), { headers }),
          fetch(apiUrl(`/articles/${id}/related`), { headers }),
        ]);

        if (aRes.status === 401 || rRes.status === 401) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('adminToken');
          navigate('/login', { state: { redirectTo: `/articles/${id}` } });
          return;
        }

        const articlePayload = await aRes.json();
        if (!aRes.ok) throw new Error(articlePayload.error || 'Unable to load article');

        let relatedPayload = null;
        if (rRes.ok) relatedPayload = await rRes.json();

        if (!mounted) return;
        setArticle(articlePayload);
        setRelated(relatedPayload);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load article');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [id, navigate]);

  const imageSrc = articleImage(article?.imageUrl);
  const fullBody = article?.fullBody || article?.body || '';

  return (
    <div id="container">
      <Navbar />
      <div className="article-detail-page">
        {loading ? (
          <p style={{ color: '#888' }}>Loading article...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : (
          <>
            <Link to="/" className="read-more" style={{ marginBottom: 16, display: 'inline-block' }}>← Back</Link>
            <h1 className="article-detail-title">{article.title}</h1>
            {article.meta && <p className="article-detail-meta">{article.meta}</p>}
            {imageSrc && (
              <div className="article-detail-image-wrap">
                <img src={imageSrc} alt={article.title} />
              </div>
            )}
            <div className="article-detail-body">
              {String(fullBody).split(/\n+/).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {related && (
              <div className="article-detail-related">
                <h3 className="admin-section-title" style={{ marginBottom: 8 }}>Random Related Article</h3>
                <h4 style={{ margin: '0 0 6px', color: '#ddd' }}>{related.title}</h4>
                <p style={{ margin: 0, color: '#888' }}>{String(related.body || '').slice(0, 160)}...</p>
                <button
                  type="button"
                  className="admin-btn"
                  style={{ marginTop: 12 }}
                  onClick={() => navigate(`/articles/${related._id}`)}
                >
                  Read This One
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
