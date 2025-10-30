import Task from '../models/task.model.js'

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body
        const userId = req.userId

        if (!title?.trim()) {
            return res.status(400).json({ message: 'Title is required' })
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || '',
            userId
        })

        return res.status(201).json({
            task
        })

    } catch (error) {
        console.error(`Error while creating new task: ${error}`);
        return res.status(500).json({
            message: 'Server error while creating new task. Please try again later'
        })
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId })
            .sort({ createdAt: -1 })

        return res.status(200).json({ tasks })
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Error fetching tasks' })
    }
}