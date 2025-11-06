export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    return (
        <li>
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}

            <span>status: {task.status}</span> - <span>priority: {task.priority}</span>
            <select
                name="status"
                id="status"
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value)}
            >
                <option value="todo">To Do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
            </select>
            <small>
                Created: {new Date(task.createdAt).toLocaleDateString()}
                {task.updatedAt !== task.createdAt && (
                    <> | Edited: {new Date(task.updatedAt).toLocaleTimeString()}</>
                )}
            </small>
            <button type="button" onClick={() => onEdit(task)}>Edit</button>
            <button type="button" onClick={() => onDelete(task._id)}>Delete</button>
            <hr />
        </li>
    )
}