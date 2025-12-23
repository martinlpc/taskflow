import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createTask, getTasks, updateTask, deleteTask } from "../services/taskService.js";
import TaskCard from "../components/TaskCard.jsx"
import Modal from "../components/Modal.jsx";

export default function Tasks() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: [],
        dueDate: '',
        startDate: '',
        endDate: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const [editingTask, setEditingTask] = useState(null)
    const [taskToDelete, setTaskToDelete] = useState(null)
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all')
    const [filterPriority, setFilterPriority] = useState(searchParams.get('priority') || 'all')
    const [searchTerm, setSearchTerm] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [filterTag, setFilterTag] = useState(searchParams.get('tag') || '')

    useEffect(() => {
        fetchTasks()
    }, [])

    useEffect(() => {
        // Actualizar query params cuando cambien los filtros
        const newParams = new URLSearchParams()

        if (filterStatus !== 'all') {
            newParams.set('status', filterStatus)
        }

        if (filterPriority !== 'all') {
            newParams.set('priority', filterPriority)
        }

        if (filterTag) {
            newParams.set('tag', filterTag)
        }

        setSearchParams(newParams)
    }, [filterStatus, filterPriority, filterTag, searchParams, setSearchParams])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.length === 0 || searchTerm.length >= 3) {
                fetchTasks()
            }
        }, 400)

        return () => clearTimeout(timeoutId)
    }, [searchTerm, filterStatus, filterPriority, filterTag])

    const getAllTags = () => {
        const allTags = tasks.flatMap(task => task.tags || [])
        return [...new Set(allTags)].sort()
    }

    const fetchTasks = async () => {
        try {
            const filters = {}
            if (filterStatus !== 'all') filters.status = filterStatus
            if (filterPriority !== 'all') filters.priority = filterPriority
            if (searchTerm.trim()) filters.search = searchTerm.trim()
            if (filterTag) filters.tags = filterTag

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
            description: task.description || '',
            tags: task.tags || [],
            dueDate: task.dueDate ? task.dueDate.slice(0, 16) : '',
            startDate: task.startDate ? task.startDate.slice(0, 16) : '',
            endDate: task.endDate ? task.endDate.slice(0, 16) : ''
        })
        setError('')
        setSuccess('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleFormChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
        if (error) setError('')
        if (success) setSuccess('')
    }

    const handleCancel = () => {
        setEditingTask(null)
        setFormData({ title: '', description: '', tags: [], dueDate: '', startDate: '', endDate: '' })
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

    const handlePriorityChange = async (taskId, newPriority) => {
        try {
            const taskToUpdate = tasks.find(t => t._id === taskId)
            await updateTask(taskId, {
                title: taskToUpdate.title,
                description: taskToUpdate.description,
                status: taskToUpdate.status,
                priority: newPriority
            })
            fetchTasks()
        } catch {
            setError('Error updating priority')
        }
    }

    const handleAddTag = (e) => {
        e.preventDefault()
        const newTag = tagInput.trim().toLocaleLowerCase()

        if (newTag && !formData.tags.includes(newTag)) {
            setFormData({ ...formData, tags: [...formData.tags, newTag] })
            setTagInput('')
            if (error) setError('')
            if (success) setSuccess('')
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        })

        if (error) setError('')
        if (success) setSuccess('')
    }

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTag(e)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const title = formData.title.trim()
        const description = formData.description.trim()
        const tags = formData.tags

        // Convert dates to ISO if existing
        const dueDate = formData.dueDate ? new Date(formData.dueDate).toISOString() : null
        const startDate = formData.startDate ? new Date(formData.startDate).toISOString() : null
        const endDate = formData.endDate ? new Date(formData.endDate).toISOString() : null


        if (!title) {
            setError('Title is required')
            return
        }

        setLoading(true)
        try {
            if (editingTask) {
                await updateTask(editingTask._id, {
                    title,
                    description,
                    status: editingTask.status,
                    priority: editingTask.priority,
                    tags,
                    dueDate: dueDate || null,
                    startDate: startDate || null,
                    endDate: endDate || null
                })
                setSuccess('Task updated!')
            }
            else {
                await createTask(title, description, tags, dueDate || null, startDate || null, endDate || null)
                setSuccess('Task created!')
            }

            setFormData({ title: '', description: '', tags: [], dueDate: '', startDate: '', endDate: '' })
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
                                        onChange={(e) => handleFormChange('title', e.target.value)}
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
                                        onChange={(e) => handleFormChange('description', e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>

                                {/* Tags input */}
                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </label>
                                    {/* Existing tags */}
                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                                >
                                                    #{tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTag(tag)}
                                                        className="hover:text-red-600"
                                                    >
                                                        x
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tag input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="tags"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            placeholder="Add a tag..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <small className="text-gray-500 text-xs mt-1 block">
                                        Press Enter or click Add to create a tag
                                    </small>
                                </div>

                                {/* Date inputs */}
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700">Schedule (optional)</h3>

                                    {/*Start Date */}
                                    <div>
                                        <label htmlFor="startDate" className="block text-xs font-medium text-gray-600 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="startDate"
                                            value={formData.startDate}
                                            onChange={(e) => handleFormChange('startDate', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label htmlFor="endDate" className="block text-xs font-medium text-gray-600 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="endDate"
                                            value={formData.endDate}
                                            onChange={(e) => handleFormChange('endDate', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                        <label htmlFor="dueDate" className="block text-xs font-medium text-gray-600 mb-1">
                                            Due Date (deadline)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="dueDate"
                                            value={formData.dueDate}
                                            onChange={(e) => handleFormChange('dueDate', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <small className="text-xs text-gray-500 block">
                                        Add dates to see tasks in calendar view
                                    </small>
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

                        {/* Filter Section */}
                        <div className="space-y-3 mb-6">
                            {/* Status Filters */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Status
                                </label>
                                <div className="flex flex-wrap gap-2">
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
                            </div>

                            {/* Priority Filters */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Priority
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setFilterPriority('all')}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filterPriority === 'all'
                                            ? 'bg-gray-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        All Priorities
                                    </button>
                                    <button
                                        onClick={() => setFilterPriority('low')}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filterPriority === 'low'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        Low
                                    </button>
                                    <button
                                        onClick={() => setFilterPriority('medium')}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filterPriority === 'medium'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        Medium
                                    </button>
                                    <button
                                        onClick={() => setFilterPriority('high')}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filterPriority === 'high'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        High
                                    </button>
                                </div>
                            </div>

                            {/* Tag Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Tag
                                </label>

                                {getAllTags().length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setFilterTag('')}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterTag === ''
                                                ? 'bg-gray-600 text-white'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            All Tags
                                        </button>

                                        {getAllTags().map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => setFilterTag(tag)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterTag === tag
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                                                    }`}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">
                                        No tags available. Add tags to your tasks to filter them.
                                    </p>
                                )}

                            </div>
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
                                        onPriorityChange={handlePriorityChange}
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