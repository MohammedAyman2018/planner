import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database')
        console.log('Connected to MongoDB')
        return mongoose.connection
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        throw error
    }
}