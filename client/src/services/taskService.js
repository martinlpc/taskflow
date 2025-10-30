import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

export const createTask = async (title, description) => {
    const token = localStorage.getItem('token')

    return await axios.post(
        `${API_URL}/tasks`,
        { title, description },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}