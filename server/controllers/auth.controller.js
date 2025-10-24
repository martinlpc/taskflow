import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body

        if (!name?.trim() || !email?.trim() || !password?.trim()) {
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
        console.error(`Error while registering new user: ${error}`)
        return res.status(500).json({
            message: 'Server error registering new user'
        })

    }
}