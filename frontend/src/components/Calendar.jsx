import React, { useState } from 'react';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function CalendarWidget({ events }) {
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState('');

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const today = new Date();

  function dateKey(dateInput) {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  const todayKey = dateKey(today);

  // Build a set of days that have events in the current month/year
  const eventDays = new Set(
    (events || [])
      .map(e => new Date(e.date))
      .filter(d => d.getFullYear() === year && d.getMonth() === month)
      .map(d => d.getDate())
  );

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    setCalDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCalDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  // Upcoming events: future events sorted by date
  const upcoming = (events || [])
    .filter(e => dateKey(e.date) >= todayKey)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const selectedDateEvents = selectedDateKey
    ? (events || [])
        .filter(e => dateKey(e.date) === selectedDateKey)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  function formatBadge(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="sidebar-widget" id="calendar-widget">
      <div className="widget-header">
        <span className="widget-icon">📅</span>
        <h3 className="widget-title">Events Calendar</h3>
      </div>
      <div className="calendar">
        <div className="cal-nav">
          <button className="cal-btn" onClick={prevMonth}>&#8249;</button>
          <span className="cal-month-label">{MONTH_NAMES[month]} {year}</span>
          <button className="cal-btn" onClick={nextMonth}>&#8250;</button>
        </div>
        <div className="cal-weekdays">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="cal-grid">
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`b${i}`} className="cal-day blank" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
            const dayDate = new Date(year, month, d);
            const dayKey = dateKey(dayDate);
            const isToday = dayKey === todayKey;
            const hasEvent = eventDays.has(d);
            const isSelected = dayKey === selectedDateKey;
            let cls = 'cal-day';
            if (hasEvent && isToday) cls += ' has-event is-today';
            else if (hasEvent) cls += ' has-event';
            else if (isToday) cls += ' is-today';
            if (isSelected) cls += ' is-selected';

            return (
              <button
                key={d}
                type="button"
                className={cls}
                onClick={() => setSelectedDateKey(dayKey)}
                title={hasEvent ? 'View events on this date' : 'No events on this date'}
              >
                {d}
              </button>
            );
          })}
        </div>
        <div className="cal-legend">
          <span className="legend-dot event-dot"></span><span>Event</span>
          <span className="legend-dot today-dot"></span><span>Today</span>
        </div>
      </div>
      {selectedDateKey && (
        <div className="selected-date-events">
          <div className="selected-date-header">
            <span className="selected-date-title">Events on {new Date(selectedDateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <button type="button" className="clear-selected-date" onClick={() => setSelectedDateKey('')}>Clear</button>
          </div>
          {selectedDateEvents.length === 0 ? (
            <p className="selected-date-empty">No events on this date.</p>
          ) : (
            <ul className="selected-date-list">
              {selectedDateEvents.map(e => (
                <li key={e._id} className="selected-date-item">
                  <span className="event-name">{e.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <ul className="upcoming-events">
        {upcoming.length === 0 && (
          <li style={{ padding: '12px 18px', color: '#555', fontSize: '12px' }}>No upcoming events.</li>
        )}
        {upcoming.map(e => (
          <li key={e._id} className="upcoming-event">
            <span className="event-date-badge">{formatBadge(e.date)}</span>
            <span className="event-name">{e.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
