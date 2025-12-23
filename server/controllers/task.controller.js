import Task from '../models/task.model.js'

export const createTask = async (req, res) => {
    try {
        const { title, description, tags, dueDate, startDate, endDate } = req.body
        const userId = req.userId

        if (!title?.trim()) {
            return res.status(400).json({ message: 'Title is required' })
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || '',
            tags: tags || [],
            dueDate: dueDate || null,
            startDate: startDate || null,
            endDate: endDate || null,
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
        const { status, priority, search, tags } = req.query

        const filter = { userId: req.userId }

        if (status) filter.status = status
        if (priority) filter.priority = priority
        if (tags) filter.tags = { $in: tags.split(',') }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 })

        return res.status(200).json({ tasks })
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Error fetching tasks' })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, status, priority, tags, dueDate, startDate, endDate } = req.body

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
        if (tags !== undefined) task.tags = tags
        if (dueDate !== undefined) task.dueDate = dueDate
        if (startDate !== undefined) task.startDate = startDate
        if (endDate !== undefined) task.endDate = endDate

        await task.save()

        return res.status(200).json(task)
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Error updating task' })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        if (task.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        await Task.deleteOne(task)

        return res.status(200).json({ message: 'Task deleted' })

    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Error deleting task' })
    }
}