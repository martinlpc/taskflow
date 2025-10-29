import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body

        // Normalize inputs
        name = name?.trim()
        email = email?.trim()?.toLowerCase()
        // Do not change password semantics, only trim for emptiness check
        const hasPassword = typeof password === 'string' && password.trim().length > 0

        if (!name || !email || !hasPassword) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        // Handle duplicate key error from unique index on email
        if (error && (error.code === 11000) && (error.keyPattern?.email || error.keyValue?.email)) {
            return res.status(400).json({ message: 'Email already registered' })
        }
        console.error(`Error while registering new user: ${error}`)
        return res.status(500).json({
            message: 'Server error registering new user'
        })

    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        // Normalize email for lookup to match schema (lowercase + trim)
        email = email.trim().toLowerCase()

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        })

    } catch (error) {
        console.error(`Error while signing in: ${error}`);
        return res.status(500).json({
            message: 'Server error while signing in'
        })
    }
}
