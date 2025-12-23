import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

export const createTask = async (title, description, tags = [], dueDate = null, startDate = null, endDate = null) => {
    const token = localStorage.getItem('token')

    return await axios.post(
        `${API_URL}/tasks`,
        { title, description, tags, dueDate, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
    )
}

export const getTasks = async (filters = {}) => {
    const token = localStorage.getItem('token')
    const params = new URLSearchParams()

    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.search) params.append('search', filters.search)
    if (filters.tags) params.append('tags', filters.tags)

    const queryString = params.toString()
    const url = queryString ? `${API_URL}/tasks?${queryString}` : `${API_URL}/tasks`

    return await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export const updateTask = async (id, taskData) => {
    const token = localStorage.getItem('token')

    return await axios.put(
        `${API_URL}/tasks/${id}`,
        taskData,
        { headers: { Authorization: `Bearer ${token}` } }
    )
}

export const deleteTask = async (id) => {
    const token = localStorage.getItem('token')

    return await axios.delete(
        `${API_URL}/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
}