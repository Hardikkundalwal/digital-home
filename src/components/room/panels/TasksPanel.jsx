import { useState } from 'react';
import { useTasks } from '../../../hooks/useTasks';
import TaskItem from '../../TaskItem';

export default function TasksPanel({ roomId }) {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks(roomId);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(input);
    setInput('');
  };

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Add a task…" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
        <button type="submit">Add</button>
      </form>
      <div className="task-list">
        {loading && <p className="muted">Loading…</p>}
        {!loading && tasks.length === 0 && <p className="muted">No tasks yet.</p>}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id, task.done)} onDelete={() => deleteTask(task.id)} />
        ))}
      </div>
    </div>
  );
}
