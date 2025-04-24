import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: String,
    icon: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Use this approach to prevent model recompilation errors
export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
