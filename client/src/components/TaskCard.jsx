export default function TaskCard({ task }) {
    return (
        <li>
            <h3>{task.title}</h3>
            {task.description ?? <p>${task.description}</p>}
            <hr />
            <span>status: {task.status}</span> - <span>priority: {task.priority}</span>
        </li>
    )
}