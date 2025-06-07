import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';

function LeagueMatchupBanner({ leagueId }) {
  const [matchups, setMatchups] = useState([]);
  const [scrollWidth, setScrollWidth] = useState(0);

  // Ref for the *single* matchup set (not duplicated)
  const singleSetRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/league-matchups/${leagueId}`)
      .then((res) => res.json())
      .then((data) => {
        setMatchups(data.matchups);
      })
      .catch((err) => console.error('Error loading matchups:', err));
  }, [leagueId]);

  // Measure width of one set of matchups after render/layout
  useLayoutEffect(() => {
    if (singleSetRef.current) {
      // Use getBoundingClientRect for fractional pixel accuracy
      const width = singleSetRef.current.getBoundingClientRect().width;
      setScrollWidth(width);
    }
  }, [matchups]);

  if (!matchups.length) return null;

  const GoldBar = () => (
    <div
      style={{
        width: 2,
        height: 40,
        backgroundColor: '#b68b2f',
        margin: '0 16px',
        alignSelf: 'center',
        borderRadius: 2,
        flexShrink: 0,
      }}
    />
  );

  const matchupContent = (
    <div
      ref={singleSetRef}
      style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
    >
      {matchups.map((m, i) => {
        const userScore = m.teamA?.points ?? 0;
        const oppScore = m.teamB?.points ?? 0;

        return (
          <React.Fragment key={i}>
            {i !== 0 && <GoldBar />}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '0 5px',
                flexShrink: 0,
                fontSize: '0.9rem',
                color: '#eee',
                minWidth: 220,
              }}
            >
              {m.teamA?.avatar && (
                <img
                  src={`https://sleepercdn.com/avatars/thumbs/${m.teamA.avatar}`}
                  alt={`${m.teamA.name} avatar`}
                  style={{ width: 24, height: 24, borderRadius: '50%' }}
                />
              )}
              <span>{m.teamA?.name || 'Unknown'}</span>
              <span
                style={{
                  color:
                    userScore > oppScore
                      ? '#28a745'
                      : userScore < oppScore
                      ? '#dc3545'
                      : '#f5e96e',
                  fontWeight: '600',
                }}
              >
                {userScore}
              </span>

              <span style={{ color: '#aaa' }}>vs</span>

              {m.teamB?.avatar && (
                <img
                  src={`https://sleepercdn.com/avatars/thumbs/${m.teamB.avatar}`}
                  alt={`${m.teamB.name} avatar`}
                  style={{ width: 24, height: 24, borderRadius: '50%' }}
                />
              )}
              <span>{m.teamB?.name || 'Bye'}</span>
              <span
                style={{
                  color:
                    oppScore > userScore
                      ? '#28a745'
                      : oppScore < userScore
                      ? '#dc3545'
                      : '#f5e96e',
                  fontWeight: 'bold',
                }}
              >
                {oppScore}
              </span>
            </div>
          </React.Fragment>
        );
      })}
      <GoldBar />
    </div>
  );

  return (
    <div
      style={{
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#111',
        borderTop: '2px solid #f2f0e6',
        borderBottom: '2px solid #f2f0e6',
        color: '#eee',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Segoe UI, sans-serif',
        userSelect: 'none',
        paddingLeft: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          animation: `scroll-left 70s linear infinite`,
          width: scrollWidth ? scrollWidth * 2 : 'max-content',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {matchupContent}
        {matchupContent}
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${scrollWidth}px);
          }
        }
      `}</style>
    </div>
  );
}

export default LeagueMatchupBanner;