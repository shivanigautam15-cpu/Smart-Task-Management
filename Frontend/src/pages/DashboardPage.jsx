import { useMemo, useState } from 'react'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

function DashboardPage({
  tasks,
  userName,
  onCreateTask,
  onLogout,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  isModalOpen,
  editingTask,
  onCloseModal,
  onSaveTask,
  isLoading,
  errorMessage,
}) {
  const [activeFilter, setActiveFilter] = useState('All')

  const summaryStats = useMemo(() => {
    const total = tasks.length
    const inProgress = tasks.filter((task) => task.status === 'In Progress').length
    const highPriority = tasks.filter((task) => task.priority === 'High').length

    return [
      { label: 'Total Tasks', value: total, tone: 'bg-light' },
      { label: 'In Progress', value: inProgress, tone: 'bg-light' },
      { label: 'High Priority', value: highPriority, tone: 'bg-light' },
    ]
  }, [tasks])

  const visibleTasks = useMemo(() => {
    if (activeFilter === 'All') return tasks
    return tasks.filter((task) => task.status === activeFilter)
  }, [activeFilter, tasks])

  const filters = ['All', 'Pending', 'In Progress', 'Completed']

  return (
    <main className="dashboard-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">Daily focus</p>
          <h2>Hello, {userName}!</h2>
        </div>

        <div className="header-actions">
          <button type="button" className="btn btn-primary" onClick={onCreateTask}>
            New task
          </button>
          <button type="button" className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="content-header">
          <div>
            <p className="eyebrow">Workspace overview</p>
            <h3>Your task overview</h3>
          </div>
          <span className="summary-pill">{tasks.length} active items</span>
        </div>

        <div className="row g-3 mb-4 mt-1">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="col-12 col-md-6 col-lg-4">
              <div className={`card shadow-sm rounded-3 ${stat.tone}`}>
                <div className="card-body">
                  <p className="text-muted mb-2">{stat.label}</p>
                  <h4 className="mb-0">{stat.value}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mb-4 pt-3 pb-2">
          <div>
            <p className="eyebrow mb-1">Quick view</p>
            <h5 className="mb-0">Filter tasks by status</h5>
          </div>

          <div className="btn-group rounded-pill border" role="group" aria-label="Task status filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`btn btn-sm rounded-pill ${activeFilter === filter ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

        <div className="tasks-grid mt-2">
          {isLoading ? (
            <div className="fallback-message">
              <p>Loading tasks...</p>
            </div>
          ) : visibleTasks.length > 0 ? (
            visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onToggleStatus={onToggleStatus}
              />
            ))
          ) : (
            <div className="fallback-message">
              <p>No tasks match this filter yet.</p>
            </div>
          )}
        </div>
      </section>

      <TaskModal
        isOpen={isModalOpen}
        editingTask={editingTask}
        onClose={onCloseModal}
        onSave={onSaveTask}
      />
    </main>
  )
}

export default DashboardPage
