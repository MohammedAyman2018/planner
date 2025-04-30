import mongoose from 'mongoose'
import { IUser } from '~/interfaces/users'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    sleep_time: {
        type: String, // Store as "HH:MM" format
        required: [true, 'Sleep time is required']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    wakeup_time: {
        type: String, // Store as "HH:MM" format
        required: [true, 'Wakeup time is required']
    }
}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
