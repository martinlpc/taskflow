export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'todo':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'done':
                return 'bg-green-100 text-green-800 border-green-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'medium':
                return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <li className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{task.title}</h3>
                    {task.description && (
                        <p className="text-gray-600 text-sm">{task.description}</p>
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
            </div>

            {/* Status Change Select */}
            <div className="mb-4">
                <label htmlFor={`status-${task._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status
                </label>
                <select
                    id={`status-${task._id}`}
                    name="status"
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {/* Metadata */}
            <div className="text-xs text-gray-500 mb-4 space-y-1">
                <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                {task.updatedAt !== task.createdAt && (
                    <p>Edited: {new Date(task.updatedAt).toLocaleString()}</p>
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