export default function Home() {
    const user = JSON.parse(localStorage.getItem('user'))

    return (
        <div>
            <h1>Welcome to TaskFlow</h1>
            {user && <p>Hello, {user.name}!</p>}
            <p>You are logged in!</p>
            <a href="/tasks">Go to Tasks</a>
            <div className="bg-blue-500 text-white p-4 rounded">
                Test Tailwind
            </div>
        </div>
    )
}