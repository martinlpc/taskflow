import { useEffect, useState } from "react";
import { createTask, getTasks } from "../services/taskService.js";
import TaskCard from "../components/TaskCard.jsx"

export default function Tasks() {
    const [formData, setFormData] = useState({ title: '', description: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])

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
            await createTask(title, description)

            setSuccess('Task created successfully!')
            setFormData({ title: '', description: '' })
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
                <h2>Create new task</h2>
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
                    {loading ? 'Creating...' : 'Create task'}
                </button>
            </form>

            <hr />

            <div>
                <h2>Task List</h2>
                {tasks.length === 0 ? (
                    <p>No tasks created. Create one!</p>
                ) : (
                    <ul>
                        {tasks.map(task => (
                            <TaskCard key={task._id} task={task} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}