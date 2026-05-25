import { useState } from 'react';
import { useFolders } from '../../../hooks/useFolders';
import { X, Folder } from 'lucide-react';

export default function FoldersPanel({ roomId }) {
  const { folders, loading, addFolder, deleteFolder } = useFolders(roomId);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addFolder(input);
    setInput('');
  };

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="New subject…" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
        <button type="submit">Add</button>
      </form>
      <div className="folder-list">
        {loading && <p className="muted">Loading…</p>}
        {!loading && folders.length === 0 && <p className="muted">No subjects yet.</p>}
        {folders.map((f) => (
          <div key={f.id} className="folder-item">
            <span><Folder size={16} strokeWidth={1.5} /> {f.name}</span>
            <button className="btn-small btn-ghost" onClick={() => deleteFolder(f.id)}><X size={16} strokeWidth={1.5} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
