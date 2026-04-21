const express = require('express');
const authAny = require('../middleware/authAny');

const router = express.Router();

// GET /api/chess/live-scores
// Uses a Lichess arena/swiss tournament id from env: LICHESS_TOURNAMENT_ID
router.get('/chess/live-scores', authAny, async (req, res) => {
  const tournamentId = process.env.LICHESS_TOURNAMENT_ID;
  if (!tournamentId) {
    return res.status(503).json({
      error: 'Live scores not configured',
      hint: 'Set LICHESS_TOURNAMENT_ID in backend .env',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`https://lichess.org/api/tournament/${tournamentId}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Unable to fetch live scores' });
    }

    const data = await response.json();
    const topStandings = (data?.standing?.players || []).slice(0, 10).map((p, idx) => ({
      rank: p.rank || idx + 1,
      username: p.name,
      score: p.score,
      games: p.nb,
      rating: p.rating,
      title: p.title || '',
    }));

    return res.json({
      source: 'Lichess',
      tournament: {
        id: data?.id,
        name: data?.fullName || data?.name || 'Live Tournament',
        status: data?.status || 'unknown',
      },
      standings: topStandings,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Live scores request timed out' });
    }
    return res.status(500).json({ error: err.message || 'Live scores unavailable' });
  } finally {
    clearTimeout(timeout);
  }
});

module.exports = router;
