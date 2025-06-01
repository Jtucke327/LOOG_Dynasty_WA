const express = require('express');
const router = express.Router();

const SLEEPER_BASE = 'https://api.sleeper.app/v1';

router.get('/league-matchups/:leagueId', async (req, res) => {
  const { leagueId } = req.params;
  try {
    const leagueRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}`);
    const league = await leagueRes.json();

    let currentWeek = league?.current_week || 1;

    let matchupsRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}/matchups/${currentWeek}`);
    let matchups = await matchupsRes.json();

    if (!matchups || !Array.isArray(matchups) || matchups.length === 0) {
      console.log('No matchups for current week, trying week 1...');
      if (currentWeek !== 1) {
        matchupsRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}/matchups/1`);
        matchups = await matchupsRes.json();
        console.log('Matchups for week 1:', matchups);
        if (!matchups || !Array.isArray(matchups) || matchups.length === 0) {
          return res.status(404).json({ error: 'No matchups found for current or week 1' });
        }
        currentWeek = 1;
      } else {
        return res.status(404).json({ error: 'No matchups found for week 1' });
      }
    }

    const rostersRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}/rosters`);
    const rosters = await rostersRes.json();

    const usersRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}/users`);
    const users = await usersRes.json();

    const rosterIdToTeam = {};
    rosters.forEach(r => {
      const user = users.find(u => u.user_id === r.owner_id);
      rosterIdToTeam[r.roster_id] = {
        name: user?.display_name || 'Unknown',
        avatar: user?.avatar || null
      };
    });

    const groupedMatchups = {};
    matchups.forEach(m => {
      if (!groupedMatchups[m.matchup_id]) groupedMatchups[m.matchup_id] = [];
      groupedMatchups[m.matchup_id].push(m);
    });

    const formattedMatchups = Object.values(groupedMatchups).map(pair => {
      const teamA = pair[0];
      const teamB = pair[1];
      return {
        matchup_id: teamA.matchup_id,
        teamA: {
          roster_id: teamA.roster_id,
          name: rosterIdToTeam[teamA.roster_id]?.name,
          avatar: rosterIdToTeam[teamA.roster_id]?.avatar,
          points: teamA.points || 0
        },
        teamB: teamB
          ? {
              roster_id: teamB.roster_id,
              name: rosterIdToTeam[teamB.roster_id]?.name,
              avatar: rosterIdToTeam[teamB.roster_id]?.avatar,
              points: teamB.points || 0
            }
          : null
      };
    });

    res.json({
      week: currentWeek,
      matchups: formattedMatchups,
      leagueLogo:
        league.avatar || league.logo
          ? `https://sleepercdn.com/avatars/league/${league.avatar || league.logo}.png`
          : null
    });
  } catch (err) {
    console.error('Error in /league-matchups:', err);
    res.status(500).json({ error: 'Failed to fetch league matchups' });
  }
});

router.get('/announcements', (req, res) => {
  res.json([
    'Welcome to the League!',
    'Draft day is June 5th!'
  ]);
});

router.get('/events', (req, res) => {
  res.json([
    { date: '2025-06-05', title: 'Draft Day' },
    { date: '2025-07-01', title: 'Trade Deadline' },
    { date: '2025-08-15', title: 'Playoffs Begin' }
  ]);
});

module.exports = router;