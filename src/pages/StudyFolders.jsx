import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useFolders } from '../hooks/useFolders';
import { X } from 'lucide-react';

export default function StudyFolders() {
  const { roomId } = useOutletContext();
  const { folders, loading, addFolder, deleteFolder } = useFolders(roomId);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addFolder(input);
    setInput('');
  };

  return (
    <div>
      <p className="muted" style={{ textAlign: 'left', padding: '0 0 0.75rem' }}>
        Folders help organize your tasks and notes by subject.
      </p>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New subject..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Add</button>
      </form>

      <div className="folder-list">
        {loading && <p className="muted">Loading...</p>}
        {!loading && folders.length === 0 && <p className="muted">No subjects yet. Create one above, then use it to organize tasks and notes.</p>}
        {folders.map((f) => (
          <div key={f.id} className="folder-item">
            <span>📁 {f.name}</span>
            <button className="btn-small btn-ghost" onClick={() => deleteFolder(f.id)}><X size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
