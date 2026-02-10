import prisma from "../config/database.js"

export const createTask = async (req, res) => {
    try {
        const { title, description, tags, dueDate, startDate, endDate } = req.body
        const userId = req.userId

        if (!title?.trim()) {
            return res.status(400).json({ message: 'Title is required' })
        }

        //const task = await Task.create({
        const task = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                tags: tags || [],
                dueDate: dueDate ? new Date(dueDate) : null,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                userId
            }
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

        const where = { userId }

        if (status) where.status = status
        if (priority) where.priority = priority
        if (tags) where.tags = { hasSome: tags.split(',') }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        //const tasks = await Task.find(filter).sort({ createdAt: -1 })
        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

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

        //const task = await Task.findById(id)
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        })

        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        if (task.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const data = {}

        if (title !== undefined) data.title = title.trim()
        if (description !== undefined) data.description = description?.trim() || null
        if (status) data.status = status
        if (priority) data.priority = priority
        if (tags !== undefined) data.tags = tags
        if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null
        if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null
        if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null

        //await task.save()
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data
        })

        return res.status(200).json(task)
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Error updating task' })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params

        //const task = await Task.findById(id)
        const task = await prisma.task.findUnique({ where: { id: parseInt(id) } })

        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        if (task.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        //await Task.deleteOne(task)
        await prisma.task.delete({ where: { id: parseInt(id) } })

        return res.status(200).json({ message: 'Task deleted' })

    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Error deleting task' })
    }
}