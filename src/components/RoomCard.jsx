export default function RoomCard({ emoji, name, description, onClick, locked, summary, roomId }) {
  return (
    <button
      className={`room-card ${locked ? 'locked' : ''}`}
      onClick={locked ? undefined : onClick}
      disabled={locked}
      data-room={roomId}
    >
      <span className="room-card-emoji">{emoji}</span>
      <h3>{name}</h3>
      <p>{description}</p>
      {summary && <div className="room-summary">{summary}</div>}
      {locked && <span className="lock-badge">🔒</span>}
    </button>
  );
}
