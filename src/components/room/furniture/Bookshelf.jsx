export default function Bookshelf({ onClick, active }) {
  return (
    <button className={`furniture f-shelf ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="shelf-row">
        <div className="book" style={{ height: '70%', background: '#8b6f47' }} />
        <div className="book" style={{ height: '55%', background: '#7a9e6b' }} />
        <div className="book" style={{ height: '80%', background: '#6b8f9e' }} />
      </div>
      <div className="shelf-row">
        <div className="book" style={{ height: '60%', background: '#c49a6c' }} />
        <div className="book" style={{ height: '75%', background: '#a87d58' }} />
      </div>
    </button>
  );
}
