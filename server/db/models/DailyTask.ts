import mongoose from 'mongoose'

const dailyTaskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    activity_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: [true, 'Activity ID is required']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'postponed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true })

// Compound index to ensure a user doesn't have duplicate tasks for the same activity on the same date
dailyTaskSchema.index({ user_id: 1, date: 1, activity_id: 1 }, { unique: true })

export const DailyTask = mongoose.models.DailyTask || mongoose.model('DailyTask', dailyTaskSchema)
