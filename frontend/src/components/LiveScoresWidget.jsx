import React, { useEffect, useState } from 'react';
import { apiUrl, getAuthToken } from '../utils/api';

export default function LiveScoresWidget() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await fetch(apiUrl('/chess/all-results'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Unable to load chess results');
        if (!mounted) return;
        setData(payload);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Chess results unavailable');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const timer = setInterval(load, 300000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  // Separate events by category
  const liveEvents = (data?.events || []).filter(e => e.isLive);
  const finishedEvents = (data?.events || []).filter(e => !e.isLive);

  const renderEventSection = (title, events, categoryClass, showRedDot = false) => (
    <div className={`results-section ${categoryClass}`}>
      <h4 className="section-title">
        {showRedDot && <span className="red-dot">●</span>}
        {title}
      </h4>
      {events.length === 0 ? (
        <p className="section-empty">Currently no events</p>
      ) : (
        events.map(event => (
          <div key={event.id} className={`final-event-block ${event.isLive ? 'event-live' : 'event-finished'}`}>
            <p className="live-scores-tournament">{event.name}</p>
            <ul className="live-scores-list">
              {(event.standings || []).map(player => (
                <li key={`${event.id}-${player.username}-${player.rank}`} className="live-score-item">
                  <span className="live-rank">#{player.rank}</span>
                  <span className="live-user">{player.title ? `${player.title} ` : ''}{player.username}</span>
                  <span className="live-points">{player.finalScore}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="sidebar-widget" id="live-scores-widget">
      <div className="widget-header">
        <span className="widget-icon">⚔️</span>
        <h3 className="widget-title">Chess Results</h3>
      </div>

      <div className="live-scores-body">
        {loading && <p className="live-scores-msg">Loading chess results...</p>}
        {!loading && error && <p className="live-scores-msg">{error}</p>}
        {!loading && !error && (
          <>
            {renderEventSection('Live', liveEvents, 'section-live', true)}
            {renderEventSection('Finished', finishedEvents, 'section-finished')}
            {renderEventSection('Club', [], 'section-club')}
            <p className="club-event-note">Club events will be available in a future update.</p>
          </>
        )}
      </div>
    </div>
  );
}
