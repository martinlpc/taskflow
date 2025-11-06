import { useEffect, useState } from "react";
import { createTask, getTasks, updateTask, deleteTask } from "../services/taskService.js";
import TaskCard from "../components/TaskCard.jsx"
import Modal from "../components/Modal.jsx";

export default function Tasks() {
    const [formData, setFormData] = useState({ title: '', description: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const [editingTask, setEditingTask] = useState(null)
    const [taskToDelete, setTaskToDelete] = useState(null)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const response = await getTasks()

            setTasks(response.data.tasks)
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    const handleEdit = (task) => {
        setEditingTask(task)
        setFormData({
            title: task.title,
            description: task.description || ''
        })
    }

    const handleCancel = () => {
        setEditingTask(null)
        setFormData({ title: '', description: '' })
        setError('')
        setSuccess('')
    }

    const handleDeleteClick = (taskId) => {
        setTaskToDelete(taskId)
    }

    const handleDeleteConfirm = async () => {
        try {
            await deleteTask(taskToDelete)
            setSuccess('Task deleted!')
            fetchTasks()
        } catch (error) {
            setError('Error deleting task')
            console.error(error)
        } finally {
            setTaskToDelete(null)
        }
    }

    const handleDeleteCancel = () => {
        setTaskToDelete(null)
    }

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const taskToUpdate = tasks.find(t => t._id === taskId)
            await updateTask(taskId, {
                title: taskToUpdate.title,
                description: taskToUpdate.description,
                status: newStatus,
                priority: taskToUpdate.priority
            })

            fetchTasks()
        } catch (error) {
            setError('Error updating tasks')
            console.error(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const title = formData.title.trim()
        const description = formData.description.trim()

        if (!title) {
            setError('Title is required')
            return
        }

        setLoading(true)
        try {
            if (editingTask) {
                await updateTask(editingTask._id, { title, description, status: editingTask.status, priority: editingTask.priority })
                setSuccess('Task updated!')
            }
            else {
                await createTask(title, description)
                setSuccess('Task created!')
            }

            setFormData({ title: '', description: '' })
            setEditingTask(null)
            fetchTasks()

        } catch (error) {
            if (error.response) {
                setError(error.response?.data?.message || 'Error creating task')
            } else {
                setError('Network error. Try again later')
            }
            console.error(error);

        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>My Tasks</h1>

            <form onSubmit={handleSubmit}>
                <h2>
                    {editingTask ? 'Edit task' : 'Create new task'}
                </h2>
                <input type="text"
                    value={formData.title}
                    placeholder="Title"
                    name="title"
                    id="title"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                    placeholder="Description (optional)"
                    value={formData.description}
                    name="description"
                    id="description"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                {error && <p style={{ color: 'crimson' }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingTask ? 'Update task' : 'Create task')}
                </button>
                {editingTask ? <button type="button" onClick={handleCancel}>Cancel</button> : <></>}
            </form>

            <hr />

            <div>
                <h2>Task List</h2>
                {tasks.length === 0 ? (
                    <p>No tasks created. Create one!</p>
                ) : (
                    <ul>
                        {tasks.map(task => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </ul>
                )}
            </div>

            <Modal
                isOpen={!!taskToDelete}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete task"
                message="Are you sure you want to delete this task? This cannot be undone"
            />
        </div>
    )
}