import { useState } from "react";
import { register } from "../services/authService.js";
import { isAxiosError } from "axios";

export default function Register() {

    const [formData, setFormData] = useState({
        name: '',
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

        const name = formData.name.trim()
        const email = formData.email.trim()
        const password = formData.password

        if (!name || !email || !password) {
            setError('All fields are required')
            return
        }

        if (password.length < 6) {
            setError('Password must have 6 characters at least')
            return
        }

        setLoading(true)
        try {
            const response = await register(name, email, password)

            if (response?.status === 201) {
                setSuccess(response?.data?.message ?? 'Registered successfully')
                setFormData({ name: '', email: '', password: '' })
                return
            }

            setError(response?.message ?? 'Error in the registration process. Please try again.')
        } catch (error) {
            if (isAxiosError(error)) {
                const status = error.response?.status
                const apiMessage = error.response?.data?.message

                setError(`${apiMessage} (${status})`)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    id="name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
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
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <div>
                    {error && <p style={{ color: "crimson" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Sign up'}
                </button>
            </form>
        </div>
    )
}