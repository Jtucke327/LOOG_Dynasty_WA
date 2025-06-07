export default function UpcomingEvents({ events }) {
  if (!events || events.length === 0) {
    return (
      <section style={{ marginTop: '3rem', color: '#b68b2f', fontStyle: 'italic' }}>
        <h2 style={{
          fontSize: '1.75rem',
          borderBottom: '2px solid #b68b2f',
          paddingBottom: '0.5rem',
          marginBottom: '1rem'
        }}>
          Upcoming Events
        </h2>
        <p>No upcoming events.</p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: '3rem' }}>
      <h2 style={{
        fontSize: '1.75rem',
        color: '#b68b2f',
        borderBottom: '2px solid #b68b2f',
        paddingBottom: '0.5rem',
        marginBottom: '1rem'
      }}>
        Upcoming Events
      </h2>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {events.map((event) => {
          const date = new Date(event.date);
          const isValidDate = !isNaN(date);
          return (
            <li
              key={event.id || event.title + event.date}
              style={{
                backgroundColor: '#1e1e1e',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                color: '#f2f0e6',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
              }}
            >
              <strong style={{ color: '#b68b2f' }}>{event.title}</strong><br />
              {isValidDate ? (
                <time dateTime={event.date} style={{ fontSize: '0.9rem' }}>
                  {date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              ) : (
                <span style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#999' }}>
                  Date TBD
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}