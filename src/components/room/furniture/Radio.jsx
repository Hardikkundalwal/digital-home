export default function Radio({ onClick, active }) {
  return (
    <button className={`furniture f-radio ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="radio-body">
        <div className="radio-speaker" />
        <div className="radio-speaker" />
        <div className="radio-knob" />
      </div>
    </button>
  );
}
