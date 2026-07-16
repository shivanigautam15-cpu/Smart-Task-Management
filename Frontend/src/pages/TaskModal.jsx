import { useEffect, useState } from 'react'

const emptyTask = {
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
}

function TaskModal({ isOpen, editingTask, onClose, onSave }) {
  const [formData, setFormData] = useState(emptyTask)

  useEffect(() => {
    if (editingTask) {
      setFormData(editingTask)
      return
    }

    setFormData(emptyTask)
  }, [editingTask, isOpen])

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({
      ...formData,
      id: editingTask?.id ?? Date.now(),
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-card__header">
          <h3>{editingTask ? 'Edit task' : 'Create new task'}</h3>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Task title</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the objective, context, and outcome."
            />
          </label>

          <div className="form-row">
            <label className="field">
              <span>Status</span>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label className="field">
              <span>Priority</span>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
