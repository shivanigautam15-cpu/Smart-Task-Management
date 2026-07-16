import { useEffect, useState } from 'react'
import './App.css'
import { createTask, deleteTask, getTasks, loginUser, updateTask } from './api'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    if (!isLoggedIn) return

    const loadTasks = async () => {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const loadedTasks = await getTasks()
        setTasks(
          loadedTasks.map((task) => ({
            ...task,
            id: task._id,
          })),
        )
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [isLoggedIn])

  const handleAuthSubmit = async (event, formData) => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await loginUser(formData)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setUserName(response.user?.name || 'User')
      setIsLoggedIn(true)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleToggleStatus = async (taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId)
    if (!taskToUpdate) return

    const nextStatus = taskToUpdate.status === 'Completed' ? 'Pending' : 'Completed'

    try {
      const updatedTask = await updateTask(taskId, { ...taskToUpdate, status: nextStatus })
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask, id: updatedTask._id } : task)),
      )
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleSaveTask = async (task) => {
    try {
      if (task.id && tasks.some((existingTask) => existingTask.id === task.id)) {
        const updatedTask = await updateTask(task.id, task)
        setTasks((currentTasks) =>
          currentTasks.map((existingTask) =>
            existingTask.id === task.id ? { ...existingTask, ...updatedTask, id: updatedTask._id } : existingTask,
          ),
        )
      } else {
        const createdTask = await createTask(task)
        setTasks((currentTasks) => [{ ...createdTask, id: createdTask._id }, ...currentTasks])
      }
      setIsModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setTasks([])
    setErrorMessage('')
  }

  if (!isLoggedIn) {
    return <AuthPage onSubmit={handleAuthSubmit} isLoading={isLoading} errorMessage={errorMessage} />
  }

  return (
    <DashboardPage
      tasks={tasks}
      userName={userName}
      onCreateTask={handleCreateTask}
      onLogout={handleLogout}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onToggleStatus={handleToggleStatus}
      isModalOpen={isModalOpen}
      editingTask={editingTask}
      onCloseModal={() => setIsModalOpen(false)}
      onSaveTask={handleSaveTask}
      isLoading={isLoading}
      errorMessage={errorMessage}
    />
  )
}

export default App
