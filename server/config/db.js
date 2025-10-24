import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Atlas DB connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(`Error on DB connection : ${error.message}`);
        process.exit(1)
    }
}

export default connectDB