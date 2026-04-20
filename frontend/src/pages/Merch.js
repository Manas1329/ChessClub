import React, { useState, useEffect } from 'react';
import '../styles/homepage.css';
import '../styles/extraPages.css';
import Navbar from '../components/Navbar';

export default function Merch() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));

    // Load current cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('chessClubCart') || '[]');
    setCartCount(cart.length);
  }, []);

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('chessClubCart') || '[]');
    cart.push({ id: product._id, name: product.name, price: product.price });
    localStorage.setItem('chessClubCart', JSON.stringify(cart));
    setCartCount(cart.length);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div>
      <Navbar />
      <div className="merch-page">
        <h2 className="section-title">Club Merchandise</h2>
        {loading ? (
          <p style={{ color: '#555', fontSize: '14px' }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ color: '#555', fontSize: '14px' }}>No products available yet. Check back soon.</p>
        ) : (
          <div className="merch-grid">
            {products.map(p => (
              <div key={p._id} className="merch-card">
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.name} />
                )}
                <div className="merch-info">
                  <h3 className="merch-name">{p.name}</h3>
                  <p className="merch-desc">{p.description}</p>
                  <div className="merch-price">₹{p.price}</div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(p)}
                  >
                    {addedId === p._id ? '✓ Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cartCount > 0 && (
        <div className="cart-badge">
          🛒 Cart — <span className="cart-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}
