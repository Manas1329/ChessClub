const express = require('express');
const authAny = require('../middleware/authAny');

const router = express.Router();

const FINISHED_STATUSES = new Set(['finished']);
const LIVE_CACHE_TTL = 60000; // 1 minute

// Rate limiting cache for live results
let liveEventsCache = {
  data: null,
  timestamp: 0,
};

function parseIds(value) {
  return String(value || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

function isCacheValid() {
  return Date.now() - liveEventsCache.timestamp < LIVE_CACHE_TTL;
}

async function fetchTournament(tournamentId, signal) {
  const headers = { Accept: 'application/json' };
  const apiToken = process.env.LICHESS_API_TOKEN;
  if (apiToken) {
    headers.Authorization = `Bearer ${apiToken}`;
  }
  const response = await fetch(`https://lichess.org/api/tournament/${tournamentId}`, {
    headers,
    signal,
  });
  if (!response.ok) {
    throw new Error(`Unable to fetch event ${tournamentId}`);
  }
  return response.json();
}

async function finalResultsHandler(req, res) {
  const tournamentIds = parseIds(process.env.LICHESS_COMPLETED_TOURNAMENT_IDS);
  if (!tournamentIds.length) {
    return res.status(503).json({
      error: 'International final results are not configured',
      hint: 'Set LICHESS_COMPLETED_TOURNAMENT_IDS in backend .env',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const settledEvents = [];
    const pendingEvents = [];

    const results = await Promise.allSettled(
      tournamentIds.map(id => fetchTournament(id, controller.signal))
    );

    results.forEach((result, index) => {
      const requestedId = tournamentIds[index];
      if (result.status !== 'fulfilled') {
        pendingEvents.push({ id: requestedId, reason: 'fetch_failed' });
        return;
      }

      const event = result.value;
      const status = String(event?.status || '').toLowerCase();
      const isFinished =
        event?.isFinished === true ||
        FINISHED_STATUSES.has(status);

      if (!isFinished) {
        pendingEvents.push({
          id: requestedId,
          status: status || 'missing',
          isFinished: Boolean(event?.isFinished),
        });
        return;
      }

      const standings = (event?.standing?.players || []).slice(0, 10).map((p, idx) => ({
        rank: p.rank || idx + 1,
        username: p.name,
        finalScore: p.score,
        games: p.nb,
        rating: p.rating,
        title: p.title || '',
      }));

      settledEvents.push({
        id: event?.id || requestedId,
        name: event?.fullName || event?.name || `Tournament ${requestedId}`,
        status: status || (event?.isFinished ? 'finished' : 'unknown'),
        isLive: false,
        tag: 'Finished',
        standings,
      });
    });

    return res.json({
      source: 'Lichess',
      mode: 'final-results-only',
      events: settledEvents,
      pendingEvents,
      clubEventNote: 'Club event results will be added in a future update.',
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'International final results request timed out' });
    }
    return res.status(500).json({ error: err.message || 'International final results unavailable' });
  } finally {
    clearTimeout(timeout);
  }
}

async function liveResultsHandler(req, res) {
  const tournamentIds = parseIds(process.env.LICHESS_LIVE_TOURNAMENT_IDS);
  if (!tournamentIds.length) {
    return res.json({
      source: 'Lichess',
      mode: 'live-results-only',
      events: [],
      pendingEvents: [],
      clubEventNote: 'No live tournaments configured.',
      fetchedAt: new Date().toISOString(),
      cached: false,
    });
  }

  // Check cache before fetching (1-minute rate limit)
  if (isCacheValid()) {
    return res.json({
      ...liveEventsCache.data,
      cached: true,
      cacheExpiresIn: Math.ceil((LIVE_CACHE_TTL - (Date.now() - liveEventsCache.timestamp)) / 1000),
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const settledEvents = [];
    const pendingEvents = [];

    const results = await Promise.allSettled(
      tournamentIds.map(id => fetchTournament(id, controller.signal))
    );

    results.forEach((result, index) => {
      const requestedId = tournamentIds[index];
      if (result.status !== 'fulfilled') {
        pendingEvents.push({ id: requestedId, reason: 'fetch_failed' });
        return;
      }

      const event = result.value;
      const status = String(event?.status || '').toLowerCase();
      // For live results, accept unfinished tournaments
      const isOngoing = event?.isFinished !== true;

      if (!isOngoing) {
        pendingEvents.push({
          id: requestedId,
          status: status || 'missing',
          isFinished: Boolean(event?.isFinished),
          reason: 'tournament_finished',
        });
        return;
      }

      const standings = (event?.standing?.players || []).slice(0, 10).map((p, idx) => ({
        rank: p.rank || idx + 1,
        username: p.name,
        finalScore: p.score,
        games: p.nb,
        rating: p.rating,
        title: p.title || '',
      }));

      settledEvents.push({
        id: event?.id || requestedId,
        name: event?.fullName || event?.name || `Tournament ${requestedId}`,
        status: status || 'live',
        isLive: true,
        tag: 'Live',
        standings,
      });
    });

    const responseData = {
      source: 'Lichess',
      mode: 'live-results-only',
      events: settledEvents,
      pendingEvents,
      clubEventNote: 'Club event results will be added in a future update.',
      fetchedAt: new Date().toISOString(),
      cached: false,
    };

    // Update cache
    liveEventsCache = {
      data: responseData,
      timestamp: Date.now(),
    };

    return res.json(responseData);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Live results request timed out' });
    }
    return res.status(500).json({ error: err.message || 'Live results unavailable' });
  } finally {
    clearTimeout(timeout);
  }
}

async function allResultsHandler(req, res) {
  try {
    // Fetch finished and live results in parallel (but use internal calls via Promise, not HTTP)
    const [finishedRes, liveRes] = await Promise.all([
      (async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
          const tournamentIds = parseIds(process.env.LICHESS_COMPLETED_TOURNAMENT_IDS);
          if (!tournamentIds.length) return { events: [], pendingEvents: [] };
          
          const results = await Promise.allSettled(
            tournamentIds.map(id => fetchTournament(id, controller.signal))
          );
          
          const settledEvents = [];
          const pendingEvents = [];
          
          results.forEach((result, index) => {
            const requestedId = tournamentIds[index];
            if (result.status !== 'fulfilled') {
              pendingEvents.push({ id: requestedId, reason: 'fetch_failed' });
              return;
            }
            
            const event = result.value;
            const status = String(event?.status || '').toLowerCase();
            const isFinished = event?.isFinished === true || FINISHED_STATUSES.has(status);
            
            if (!isFinished) {
              pendingEvents.push({ id: requestedId, status: status || 'missing' });
              return;
            }
            
            const standings = (event?.standing?.players || []).slice(0, 10).map((p, idx) => ({
              rank: p.rank || idx + 1,
              username: p.name,
              finalScore: p.score,
              games: p.nb,
              rating: p.rating,
              title: p.title || '',
            }));
            
            settledEvents.push({
              id: event?.id || requestedId,
              name: event?.fullName || event?.name || `Tournament ${requestedId}`,
              status: status || (event?.isFinished ? 'finished' : 'unknown'),
              isLive: false,
              standings,
            });
          });
          
          return { events: settledEvents, pendingEvents };
        } finally {
          clearTimeout(timeout);
        }
      })(),
      (async () => {
        const tournamentIds = parseIds(process.env.LICHESS_LIVE_TOURNAMENT_IDS);
        if (!tournamentIds.length) return { events: [], pendingEvents: [] };
        
        // Check cache first for live results
        if (isCacheValid()) {
          return { events: liveEventsCache.data.events, pendingEvents: liveEventsCache.data.pendingEvents };
        }
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
          const results = await Promise.allSettled(
            tournamentIds.map(id => fetchTournament(id, controller.signal))
          );
          
          const settledEvents = [];
          const pendingEvents = [];
          
          results.forEach((result, index) => {
            const requestedId = tournamentIds[index];
            if (result.status !== 'fulfilled') {
              pendingEvents.push({ id: requestedId, reason: 'fetch_failed' });
              return;
            }
            
            const event = result.value;
            const isOngoing = event?.isFinished !== true;
            
            if (!isOngoing) {
              pendingEvents.push({ id: requestedId, reason: 'tournament_finished' });
              return;
            }
            
            const standings = (event?.standing?.players || []).slice(0, 10).map((p, idx) => ({
              rank: p.rank || idx + 1,
              username: p.name,
              finalScore: p.score,
              games: p.nb,
              rating: p.rating,
              title: p.title || '',
            }));
            
            settledEvents.push({
              id: event?.id || requestedId,
              name: event?.fullName || event?.name || `Tournament ${requestedId}`,
              status: 'live',
              isLive: true,
              standings,
            });
          });
          
          // Update cache for next request
          liveEventsCache = {
            data: { events: settledEvents, pendingEvents },
            timestamp: Date.now(),
          };
          
          return { events: settledEvents, pendingEvents };
        } finally {
          clearTimeout(timeout);
        }
      })(),
    ]);

    const allEvents = [
      ...(finishedRes.events || []).map(e => ({ ...e, tag: 'Finished' })),
      ...(liveRes.events || []).map(e => ({ ...e, tag: 'Live' })),
    ];

    return res.json({
      source: 'Lichess',
      mode: 'all-results',
      events: allEvents,
      finishedCount: finishedRes.events?.length || 0,
      liveCount: liveRes.events?.length || 0,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unable to fetch all results' });
  }
}

// GET /api/chess/final-results
router.get('/chess/final-results', authAny, finalResultsHandler);

// GET /api/chess/live-results (with 1-minute rate limit cache)
router.get('/chess/live-results', authAny, liveResultsHandler);

// GET /api/chess/all-results (combines finished + live)
router.get('/chess/all-results', authAny, allResultsHandler);

// Backward-compatible alias
router.get('/chess/live-scores', authAny, allResultsHandler);

module.exports = router;
