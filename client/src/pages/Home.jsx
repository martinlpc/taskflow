import { useNavigate } from 'react-router-dom'

export default function Home() {
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center space-y-8">
                    {/* Main Title */}
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                            Welcome to <span className="text-blue-600">TaskFlow</span>
                        </h1>
                        <p className="text-2xl text-gray-600">
                            Hi, <span className="font-semibold text-blue-600">{user?.name || 'User'}</span>! 👋
                        </p>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Stay organized and boost your productivity with our intuitive task management system.
                        Create, track, and complete your tasks with ease.
                    </p>

                    {/* CTA Button */}
                    <div className="pt-8">
                        <button
                            onClick={() => navigate('/tasks')}
                            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            <span>Get Started with Your Tasks</span>
                            <svg className="ml-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-20 grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Organization</h3>
                        <p className="text-gray-600">Create and manage all your tasks in one organized place with clear categories.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Track Progress</h3>
                        <p className="text-gray-600">Monitor your task status from To Do, In Progress, to Done in real-time.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Boost Productivity</h3>
                        <p className="text-gray-600">Achieve your goals faster with our smart task management features.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}