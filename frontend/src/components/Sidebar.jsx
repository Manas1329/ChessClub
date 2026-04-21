import React from 'react';
import Leaderboard from './Leaderboard';
import CalendarWidget from './Calendar';
import LiveScoresWidget from './LiveScoresWidget';
import { isLoggedIn } from '../utils/api';

export default function Sidebar({ members, events }) {
  const loggedIn = isLoggedIn();

  return (
    <aside className="side-section">
      <Leaderboard members={members} />
      <CalendarWidget events={events} />
      {loggedIn && <LiveScoresWidget />}

      {/* Social Links — static, matches original exactly */}
      <div className="sidebar-widget" id="social-widget">
        <div className="widget-header">
          <span className="widget-icon">🔗</span>
          <h3 className="widget-title">Follow Us</h3>
        </div>
        <div className="social-links">
          <a href="#" className="social-link" id="social-instagram">
            <span className="social-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </span>
            <div className="social-info">
              <span className="social-name">Instagram</span>
              <span className="social-handle">@chessclub</span>
            </div>
            <span className="social-arrow">→</span>
          </a>
          <a href="#" className="social-link" id="social-twitter">
            <span className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </span>
            <div className="social-info">
              <span className="social-name">X (Twitter)</span>
              <span className="social-handle">@chessclub</span>
            </div>
            <span className="social-arrow">→</span>
          </a>
          <a href="#" className="social-link" id="social-youtube">
            <span className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </span>
            <div className="social-info">
              <span className="social-name">YouTube</span>
              <span className="social-handle">Chess Club Channel</span>
            </div>
            <span className="social-arrow">→</span>
          </a>
          <a href="#" className="social-link" id="social-discord">
            <span className="social-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.1.13 18.113a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </span>
            <div className="social-info">
              <span className="social-name">Discord</span>
              <span className="social-handle">Join our server</span>
            </div>
            <span className="social-arrow">→</span>
          </a>
          <a href="#" className="social-link" id="social-lichess">
            <span className="social-icon">
              <svg viewBox="0 0 50 50" fill="currentColor">
                <path d="M38.956.5c-3.53.418-6.452 2.631-8.279 5.637L20.12 8.885c-3.416.387-5.743 3.352-5.743 6.804v6.134l-.006.134c-.063 2.607.98 5.075 2.882 6.932l.135.13-1.617 2.96-4.09-3.483c-.442-.374-1.102-.337-1.497.083l-2.493 2.617c-.395.42-.37 1.082.058 1.469l10.502 9.428c.255.23.6.316.932.232l5.284-1.36c.332-.086.602-.327.715-.648l1.127-3.22c1.999.438 4.076.353 6.034-.296l3.477 3.477c.39.39 1.024.39 1.414 0l2.83-2.83c.39-.39.39-1.023 0-1.413L38.186 35.4c1.456-2.412 2.007-5.274 1.492-8.098l.002-.002 2.086-7.617c.922-3.367-.17-6.9-2.81-9.25zm-3.847 20.311c-.826 3.022-3.976 4.808-7.04 3.988-3.062-.82-4.882-3.94-4.054-6.964.826-3.02 3.976-4.806 7.04-3.986 3.062.818 4.88 3.94 4.054 6.962z"/>
              </svg>
            </span>
            <div className="social-info">
              <span className="social-name">Lichess</span>
              <span className="social-handle">Play with us online</span>
            </div>
            <span className="social-arrow">→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
