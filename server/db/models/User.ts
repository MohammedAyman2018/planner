import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    wakeup_time: {
        type: String, // Store as "HH:MM" format
        required: [true, 'Wakeup time is required']
    }
}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model('User', userSchema)
