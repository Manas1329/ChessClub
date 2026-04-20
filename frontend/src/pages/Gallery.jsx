import React, { useState, useEffect } from 'react';
import '../styles/homepage.css';
import '../styles/extraPages.css';
import Navbar from '../components/Navbar';
import { apiUrl, toArrayResponse } from '../utils/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl('/gallery'))
      .then(r => r.json())
      .then(data => { setImages(toArrayResponse(data)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="gallery-page">
        <h2 className="section-title">Club Gallery</h2>
        {loading ? (
          <p style={{ color: '#555', fontSize: '14px' }}>Loading gallery...</p>
        ) : images.length === 0 ? (
          <p style={{ color: '#555', fontSize: '14px' }}>No images yet. Check back soon.</p>
        ) : (
          <div className="gallery-grid">
            {images.map(img => (
              <div key={img._id} className="gallery-item">
                <img src={img.imageUrl} alt={img.caption || 'Gallery image'} />
                {img.caption && <div className="gallery-caption">{img.caption}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
