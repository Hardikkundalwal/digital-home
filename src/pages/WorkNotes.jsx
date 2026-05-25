import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';

export default function WorkNotes() {
  const { roomId } = useOutletContext();
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes(roomId);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote(input);
    setInput('');
  };

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Write a note..." value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
        <button type="submit">Add</button>
      </form>

      <div className="note-list">
        {loading && <p className="muted">Loading...</p>}
        {!loading && notes.length === 0 && <p className="muted">No notes yet.</p>}
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} />
        ))}
      </div>
    </div>
  );
}
