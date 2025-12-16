import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createTask, getTasks, updateTask, deleteTask } from "../services/taskService.js";
import TaskCard from "../components/TaskCard.jsx"
import Modal from "../components/Modal.jsx";

export default function Tasks() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [formData, setFormData] = useState({ title: '', description: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const [editingTask, setEditingTask] = useState(null)
    const [taskToDelete, setTaskToDelete] = useState(null)
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchTasks()
    }, [])

    useEffect(() => {
        // Actualizar query params cuando cambia el filtro
        if (filterStatus === 'all') {
            searchParams.delete('status')
        } else {
            searchParams.set('status', filterStatus)
        }
        setSearchParams(searchParams)
    }, [filterStatus, searchParams, setSearchParams])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.length === 0 || searchTerm.length >= 3) {
                fetchTasks()
            }
        }, 400)

        return () => clearTimeout(timeoutId)
    }, [searchTerm, filterStatus])

    const fetchTasks = async () => {
        try {
            const filters = {}
            if (filterStatus !== 'all') filters.status = filterStatus
            if (searchTerm.trim()) filters.search = searchTerm.trim()

            const response = await getTasks(filters)
            setTasks(response.data.tasks)
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to load tasks')
        }
    }

    const filteredTasks = filterStatus === 'all'
        ? tasks
        : tasks.filter(task => task.status === filterStatus)

    const handleEdit = (task) => {
        setEditingTask(task)
        setFormData({
            title: task.title,
            description: task.description || ''
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">My Tasks</h1>
                    <p className="text-gray-600">Manage and organize your daily tasks efficiently</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                {editingTask ? 'Edit Task' : 'Create New Task'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Title Input */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Task Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={formData.title}
                                        placeholder="Enter task title..."
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {/* Description Input */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (optional)
                                    </label>
                                    <textarea
                                        placeholder="Add task details..."
                                        value={formData.description}
                                        id="description"
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Messages */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-700 text-sm font-medium">{error}</p>
                                    </div>
                                )}
                                {success && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-700 text-sm font-medium">{success}</p>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                                    </button>
                                    {editingTask && (
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Tasks List Section */}
                    <div className="lg:col-span-2">
                        {/* Search Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            {searchTerm.length > 0 && searchTerm.length < 3 && (
                                <small className="text-gray-500 text-sm mt-1 block">
                                    Type at least 3 characters to search
                                </small>
                            )}
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filterStatus === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                All Tasks
                            </button>
                            <button
                                onClick={() => setFilterStatus('todo')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filterStatus === 'todo'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                To Do
                            </button>
                            <button
                                onClick={() => setFilterStatus('in_progress')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filterStatus === 'in_progress'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => setFilterStatus('done')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filterStatus === 'done'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Done
                            </button>
                        </div>

                        {/* Tasks List */}
                        {filteredTasks.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
                                <p className="text-gray-600">Create your first task to get started!</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {filteredTasks.map(task => (
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
                </div>
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={!!taskToDelete}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete task"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />
        </div>
    )
}