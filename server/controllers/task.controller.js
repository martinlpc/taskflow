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

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, status, priority } = req.body

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        if (task.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        if (title) task.title = title
        if (description !== undefined) task.description = description
        if (status) task.status = status
        if (priority) task.priority = priority

        await task.save()

        return res.status(200).json(task)
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Error updating task' })
    }
}