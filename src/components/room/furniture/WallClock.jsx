export default function WallClock({ onClick, active }) {
  return (
    <button className={`furniture f-clock ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="clock-face">
        <div className="clock-inner">
          <div className="clock-hand hour" />
          <div className="clock-hand minute" />
        </div>
      </div>
    </button>
  );
}
