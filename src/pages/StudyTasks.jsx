import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { useFolders } from '../hooks/useFolders';
import TaskItem from '../components/TaskItem';

export default function StudyTasks() {
  const { roomId } = useOutletContext();
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks(roomId);
  const { folders } = useFolders(roomId);
  const [input, setInput] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(input);
    setInput('');
  };

  const filtered = selectedFolder ? tasks.filter((t) => t.folderId === selectedFolder) : tasks;

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Add a task..." value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
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

      <div className="task-list">
        {loading && <p className="muted">Loading...</p>}
        {!loading && filtered.length === 0 && <p className="muted">No tasks here.</p>}
        {filtered.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id, task.done)} onDelete={() => deleteTask(task.id)} />
        ))}
      </div>
    </div>
  );
}
