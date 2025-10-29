import { useState } from "react";
import { login } from "../services/authService.js";
import { isAxiosError } from "axios";
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        const email = formData.email.trim()
        const password = formData.password

        if (!email || !password) {
            setError('All fields are required')
            return
        }

        setLoading(true)

        try {
            const response = await login(email, password)

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))

            setSuccess('Signed in. Redirecting to home')
            setTimeout(() => navigate('/'), 1000)

        } catch (error) {
            if (isAxiosError(error)) {
                const status = error.response?.status
                const apiMessage = error.response?.data?.message

                if (status !== 500) {
                    setError(apiMessage)
                } else {
                    setError('Server error. Please try again later')
                }
            } else {
                setError('Network error. Please check your connection')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    id="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    id="password"
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <div>
                    {error && <p style={{ color: "crimson" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
                <p>
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </form>
        </div>
    )
}