import { Undo2, X, Circle } from 'lucide-react';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.done ? 'done' : ''}`}>
      <button className="task-toggle" onClick={onToggle}>
        {task.done ? <Undo2 size={16} strokeWidth={1.5} /> : <Circle size={16} strokeWidth={1.5} />}
      </button>
      <span className="task-text">{task.text}</span>
      <button className="task-delete" onClick={onDelete}><X size={16} strokeWidth={1.5} /></button>
    </div>
  );
}
