export default function TaskCard({ task, onEdit }) {
    return (
        <li>
            <h3>{task.title}</h3>
            {task.description ?? <p>${task.description}</p>}

            <span>status: {task.status}</span> - <span>priority: {task.priority}</span>
            <small>
                Created: {new Date(task.createdAt).toLocaleDateString()}
                {task.updatedAt !== task.createdAt && (
                    <> | Edited: {new Date(task.updatedAt).toLocaleTimeString()}</>
                )}
            </small>
            <button onClick={() => onEdit(task)}>Edit</button>
            <hr />
        </li>
    )
}