export default function Chair({ onClick, active }) {
  return (
    <button className={`furniture f-chair ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="chair-seat" />
      <div className="chair-back" />
    </button>
  );
}
