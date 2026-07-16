function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const badgeClass = task.status.toLowerCase().replace(/\s+/g, '-')

  return (
    <article className="task-card">
      <div className="task-card__top">
        <div>
          <p className="task-card__eyebrow">{task.priority} priority</p>
          <h4>{task.title}</h4>
        </div>
        <span className={`status-pill ${badgeClass}`}>{task.status}</span>
      </div>

      <p className="task-card__description">{task.description}</p>

      <div className="task-card__actions">
        <button type="button" className="btn btn-secondary" onClick={() => onToggleStatus(task.id)}>
          {task.status === 'Completed' ? 'Reopen task' : 'Mark done'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default TaskCard
