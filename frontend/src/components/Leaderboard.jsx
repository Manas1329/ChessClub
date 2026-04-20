import React from 'react';

function getRankClass(index) {
  if (index === 0) return 'leaderboard-item rank-1';
  if (index === 1) return 'leaderboard-item rank-2';
  if (index === 2) return 'leaderboard-item rank-3';
  return 'leaderboard-item';
}

function getTitle(elo) {
  if (elo >= 2300) return 'National Master';
  if (elo >= 2200) return 'FIDE Master';
  if (elo >= 2000) return 'Candidate Master';
  if (elo >= 1800) return 'Club Expert';
  if (elo >= 1600) return 'Advanced';
  if (elo >= 1400) return 'Intermediate';
  return 'Beginner';
}

export default function Leaderboard({ members }) {
  return (
    <div className="sidebar-widget" id="leaderboard-widget">
      <div className="widget-header">
        <span className="widget-icon">♟</span>
        <h3 className="widget-title">Club Leaderboard</h3>
      </div>
      <ul className="leaderboard-list">
        {members.length === 0 && (
          <li style={{ padding: '16px 18px', color: '#555', fontSize: '13px' }}>
            No members yet.
          </li>
        )}
        {members.map((member, i) => (
          <li key={member._id} className={getRankClass(i)}>
            <span className="rank-badge">{i + 1}</span>
            <div className="member-info">
              <span className="member-name">{member.name}</span>
              <span className="member-title">{getTitle(member.eloRating)}</span>
            </div>
            <span className="member-rating">{member.eloRating}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
