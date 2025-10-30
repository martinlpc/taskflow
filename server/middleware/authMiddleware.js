import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' })
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' })
        }

        return res.status(401).json({ message: 'Token verification failed' })
    }
}