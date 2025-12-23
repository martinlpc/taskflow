import { useState, useEffect } from 'react'
import { getTasks } from '../services/taskService.js'
import Calendar from '../components/Calendar.jsx'

export default function Home() {
    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState(null)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const response = await getTasks({})
            setTasks(response.data.tasks)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Overview of your tasks and schedule</p>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-lg shadow-lg p-6" style={{ height: '600px' }}>
                    <Calendar tasks={tasks} onSelectTask={setSelectedTask} />
                </div>

                {/* Task Details Modal */}
                {selectedTask && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedTask(null)}
                    >
                        <div
                            className="bg-white rounded-lg p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-2">{selectedTask.title}</h3>
                            {selectedTask.description && (
                                <p className="text-gray-600 mb-4">{selectedTask.description}</p>
                            )}
                            <div className="space-y-2 text-sm">
                                <p><strong>Status:</strong> {selectedTask.status}</p>
                                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                                {selectedTask.startDate && (
                                    <p><strong>Start:</strong> {new Date(selectedTask.startDate).toLocaleString()}</p>
                                )}
                                {selectedTask.endDate && (
                                    <p><strong>End:</strong> {new Date(selectedTask.endDate).toLocaleString()}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}