import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLinks } from '../hooks/useLinks';
import { X } from 'lucide-react';

export default function WorkLinks() {
  const { roomId } = useOutletContext();
  const { links, loading, addLink, deleteLink } = useLinks(roomId);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addLink(name, url);
    setName('');
    setUrl('');
  };

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        <input type="text" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} autoComplete="off" />
        <button type="submit">Add</button>
      </form>

      <div className="link-list">
        {loading && <p className="muted">Loading...</p>}
        {!loading && links.length === 0 && <p className="muted">No links yet. Add your first one above.</p>}
        {links.map((link) => (
          <div key={link.id} className="link-item">
            <a href={link.url} target="_blank" rel="noopener noreferrer">🔗 {link.name}</a>
            <button className="btn-small btn-ghost" onClick={() => deleteLink(link.id)}><X size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
