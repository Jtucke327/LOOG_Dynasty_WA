export default function Announcements({ messages }) {
  return (
    <section style={{ marginTop: '3rem' }}>
      <h2 style={{
        fontSize: '1.75rem',
        color: '#b68b2f',
        borderBottom: '2px solid #b68b2f',
        paddingBottom: '0.5rem',
        marginBottom: '1rem'
      }}>
        Announcements
      </h2>
      <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
        {messages.map((msg, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem', color: '#f2f0e6' }}>
            {msg}
          </li>
        ))}
      </ul>
    </section>
  );
}