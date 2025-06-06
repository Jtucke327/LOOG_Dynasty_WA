const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const SLEEPER_BASE = process.env.SLEEPER_BASE;

if (!SLEEPER_BASE) {
  throw new Error('Missing SLEEPER_BASE env variable');
}

//Limit Sleeper data
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per window
  message: { error: 'Too many requests, slow down.' }
});

router.use(limiter);

//Sleeper route.
//Fetches two teams in matchup
//Team names, avatars, and scores
router.get('/league-matchups/:leagueId', async (req, res) => {
  const { leagueId } = req.params;
  if (!/^\d+$/.test(leagueId)) {
    return res.status(400).json({ error: 'Invalid league ID format' });
  }
  try {

    //Get league ID and info
    const leagueRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}`);
    const league = await leagueRes.json();

    let currentWeek = league?.current_week || 1;

    //Get Matchup for current week
    let matchupsRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}/matchups/${currentWeek}`);
    let matchups = await matchupsRes.json();

    //Fallback to week 1 if needed
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

    //Get rosters
    const rostersRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}/rosters`);
    const rosters = await rostersRes.json();

    //Get Users
    const usersRes = await fetch(`${SLEEPER_BASE}/league/${leagueId}/users`);
    const users = await usersRes.json();

    //Map Roster ids to user info
    const rosterIdToTeam = {};
    rosters.forEach(r => {
      const user = users.find(u => u.user_id === r.owner_id);
      rosterIdToTeam[r.roster_id] = {
        name: user?.display_name || 'Unknown',
        avatar: user?.avatar || null
      };
    });

    //Group matchups by matchup ids
    const groupedMatchups = {};
    matchups.forEach(m => {
      if (!groupedMatchups[m.matchup_id]) groupedMatchups[m.matchup_id] = [];
      groupedMatchups[m.matchup_id].push(m);
    });

    //Format matchups for frontend
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

    //Send json response
    res.json({
      week: currentWeek,
      matchups: formattedMatchups,
      leagueLogo:
        league.avatar || league.logo
          ? `https://sleepercdn.com/avatars/league/${league.avatar || league.logo}.png`
          : null
    });
  } catch (err) {
    console.error('Error in /league-matchups:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
}
});

//Static endpoint to send league announcements as an array of strings 
router.get('/announcements', (req, res) => {
  res.json([
    'Welcome to the League of Ordinary Gentlemen!'
  ]);
});

//Static endpoint to return league events with dates and titles
router.get('/events', (req, res) => {
  res.json([
    { date: "2025-08-31T12:00:00", title: "League Dues" },
    { date: "2025-09-05T12:00:00", title: "Season Start" }
  ]);
});

module.exports = router;