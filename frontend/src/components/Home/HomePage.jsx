import React, { useEffect, useState } from 'react';
import LeagueMatchupCarousel from './LeagueMatchupCarousel';
import Announcements from './Announcements';
import UpcomingEvents from './UpcomingEvents';

function HomePage({ leagueId, userRosterId }) {
  const [announcements, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const colors = {
    background: '#121212',
    gold: '#b68b2f',
    cream: '#f2f0e6',
    brown: '#6f4f2e'
  };

  const BACKEND_URL = 'https://loog-dynasty-wa.onrender.com';
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/announcements`)
    .then(res => res.json())
    .then(data => setMessages(data))
    .catch(err => console.error('Error fetching announcements:', err));
    
    fetch(`${BACKEND_URL}/api/events`)
    .then(res => res.json())
    .then(data => setEvents(data))
    .catch(err => console.error('Error fetching events:', err));
  }, []);

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.cream,
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '2rem',
        paddingLeft: '2.5rem',
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      {/* Hamburger Menu */}
      <button
        onClick={() => setDrawerOpen(true)}
        style={{
          position: 'sticky',
          top: '1.5rem',
          left: 0,
          alignSelf: 'flex-start',
          zIndex: 1000,
          background: colors.background,
          padding: '0.5rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}
      >
        <div style={{ width: 24, height: 3, background: colors.gold, marginBottom: 5 }} />
        <div style={{ width: 24, height: 3, background: colors.gold, marginBottom: 5 }} />
        <div style={{ width: 24, height: 3, background: colors.gold }} />
      </button>

      {/* Sidebar Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: drawerOpen ? 0 : '-260px',
          width: '250px',
          height: '100vh',
          backgroundColor: colors.background,
          color: colors.cream,
          boxShadow: drawerOpen ? '2px 0 10px rgba(0,0,0,0.5)' : 'none',
          transition: 'left 0.3s ease-in-out',
          zIndex: 1100,
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            color: colors.gold,
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <a href="#" style={{ color: colors.gold, textDecoration: 'none', fontWeight: '600' }}>🏠 Home</a>
        <a href="#" style={{ color: colors.gold, textDecoration: 'none', fontWeight: '600' }}>📋 Matchups (WIP)</a>
        <a href="#" style={{ color: colors.gold, textDecoration: 'none', fontWeight: '600' }}>🙌 Hall Of Fame (WIP)</a>
        <a href="#" style={{ color: colors.gold, textDecoration: 'none', fontWeight: '600' }}>📜 Constitution (WIP)</a>
        <a href="#" style={{ color: colors.gold, textDecoration: 'none', fontWeight: '600' }}>📈 Analytics (WIP)</a>
        <a href="#" style={{ color: colors.gold, textDecoration: 'none', fontWeight: '600' }}>💸 Payments (WIP)</a>
      </div>

      {/* Header with logo */}
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            overflow: 'hidden',
            width: '100px',
            height: '100px',
            marginBottom: '1rem',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <img
            src="https://sleepercdn.com/avatars/thumbs/6ad52c4e61b556cd98322c5a7405378e"
            alt="League Logo"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <h1 style={{ color: colors.gold, fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '0.1em', textAlign: 'center' }}>
          League of Ordinary Gentlemen
        </h1>
      </header>

      {/* Ribbon */}
      <div
        style={{
          backgroundColor: colors.gold,
          color: colors.background,
          padding: '0.75rem 1.5rem',
          borderRadius: '30px',
          width: 'fit-content',
          margin: '0 auto 3rem auto',
          fontWeight: '600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          boxShadow: `0 0 15px ${colors.gold}`
        }}
      >
        Week 1 Matchup
      </div>

      {/* Carousel container */}
      <div style={{ width: '100vw', marginLeft: '-2rem' }}>
        <LeagueMatchupCarousel leagueId={leagueId} />
      </div>

      {/* Announcement Section */}
      <Announcements messages={announcements} />

      {/* Upcoming Events Section */}
      <UpcomingEvents events={events} />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '4rem',
        fontSize: '0.875rem',
        color: colors.brown,
        letterSpacing: '0.05em',
      }}>
        <div>© 2025 League of Ordinary Gentlemen</div>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span>Powered by</span>
          <a
            href="https://sleeper.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.brown, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <img
              src="/sleeper_logo.png"
              alt="Sleeper"
              style={{ height: '15px' }}
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
