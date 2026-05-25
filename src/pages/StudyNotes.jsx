import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { useFolders } from '../hooks/useFolders';
import NoteCard from '../components/NoteCard';

export default function StudyNotes() {
  const { roomId } = useOutletContext();
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes(roomId);
  const { folders } = useFolders(roomId);
  const [input, setInput] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote(input);
    setInput('');
  };

  const filtered = selectedFolder ? notes.filter((n) => n.folderId === selectedFolder) : notes;

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Write a note..." value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
        <button type="submit">Add</button>
      </form>

      {folders.length > 0 && (
        <div className="filter-bar">
          <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)}>
            <option value="">All folders</option>
            {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
      )}

      <div className="note-list">
        {loading && <p className="muted">Loading...</p>}
        {!loading && filtered.length === 0 && <p className="muted">No notes yet.</p>}
        {filtered.map((note) => (
          <NoteCard key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} />
        ))}
      </div>
    </div>
  );
}
