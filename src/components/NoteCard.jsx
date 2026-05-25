import { useState } from 'react';
import { X, Pencil } from 'lucide-react';

export default function NoteCard({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.text);

  const handleSave = () => {
    onUpdate(note.id, text);
    setEditing(false);
  };

  return (
    <div className="note-card">
      {editing ? (
        <div className="note-edit">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
          <div className="note-edit-actions">
            <button className="btn-small" onClick={handleSave}>Save</button>
            <button className="btn-small btn-ghost" onClick={() => { setText(note.text); setEditing(false); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className="note-text">{note.text}</p>
          <div className="note-actions">
            <button className="btn-small btn-ghost" onClick={() => setEditing(true)}><Pencil size={16} strokeWidth={1.5} /></button>
            <button className="btn-small btn-ghost" onClick={() => onDelete(note.id)}><X size={16} strokeWidth={1.5} /></button>
          </div>
        </>
      )}
    </div>
  );
}
