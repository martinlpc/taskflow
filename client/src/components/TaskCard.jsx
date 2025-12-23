export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onPriorityChange }) {
    const getStatusColor = (status) => {
        const colors = {
            todo: 'bg-red-100 text-red-800 border-red-200',
            in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            done: 'bg-green-100 text-green-800 border-green-200'
        }

        return colors[status] || colors.todo

    }

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-blue-100 text-blue-800 border-blue-200',
            medium: 'bg-orange-100 text-orange-800 border-orange-200',
            high: 'bg-red-100 text-red-800 border-red-200'
        }

        return colors[priority] || colors.medium
    }

    return (
        <li className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{task.title}</h3>
                    {task.description && (
                        <p className="text-gray-700 text-base leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                {/* Status Badge */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(task.status)}`}>
                    {task.status === 'in_progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}
                </span>

                {/* Priority Badge */}
                {task.priority && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                )}

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {/* Status Dropdown */}
                <div>
                    <label htmlFor={`status-${task._id}`} className="block text-xs font-medium text-gray-600 mb-1">
                        Status
                    </label>
                    <select
                        id={`status-${task._id}`}
                        value={task.status}
                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                {/* Priority Dropdown */}
                <div>
                    <label htmlFor={`priority-${task._id}`} className="block text-xs font-medium text-gray-600 mb-1">
                        Priority
                    </label>
                    <select
                        id={`priority-${task._id}`}
                        value={task.priority}
                        onChange={(e) => onPriorityChange(task._id, e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            {/* Metadata */}
            <div className="text-xs text-gray-500 mb-4 space-y-1">
                <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                {task.updatedAt !== task.createdAt && (
                    <p>Edited: {new Date(task.updatedAt).toLocaleString()}</p>
                )}

                {/* Dates section */}
                {(task.dueDate || task.startDate || task.endDate) && (
                    <div className="pt-2 mt-2 border-t border-gray-200 space-y-1">
                        {task.startDate && (
                            <p className="text-blue-600 font-medium">
                                📅 Start: {new Date(task.startDate).toLocaleString()}
                            </p>
                        )}
                        {task.endDate && (
                            <p className="text-green-600 font-medium">
                                📅 End: {new Date(task.endDate).toLocaleString()}
                            </p>
                        )}
                        {task.dueDate && (
                            <p className="text-red-600 font-medium">
                                📅 Due: {new Date(task.dueDate).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(task._id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Delete
                </button>
            </div>
        </li>
    )
}