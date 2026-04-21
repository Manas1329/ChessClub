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
        const res = await fetch(apiUrl('/chess/live-scores'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || 'Unable to load live scores');
        if (!mounted) return;
        setData(payload);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Live scores unavailable');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    const timer = setInterval(load, 60000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="sidebar-widget" id="live-scores-widget">
      <div className="widget-header">
        <span className="widget-icon">Live</span>
        <h3 className="widget-title">Live Chess Scores</h3>
      </div>

      <div className="live-scores-body">
        {loading && <p className="live-scores-msg">Loading live standings...</p>}
        {!loading && error && <p className="live-scores-msg">{error}</p>}
        {!loading && !error && data?.tournament && (
          <>
            <p className="live-scores-tournament">
              {data.tournament.name} ({data.tournament.status})
            </p>
            <ul className="live-scores-list">
              {(data.standings || []).map(player => (
                <li key={`${player.username}-${player.rank}`} className="live-score-item">
                  <span className="live-rank">#{player.rank}</span>
                  <span className="live-user">{player.title ? `${player.title} ` : ''}{player.username}</span>
                  <span className="live-points">{player.score}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
