import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    activity_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: [true, 'Activity ID is required']
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    title: {
        type: String,
        required: [true, 'Event title is required']
    },
    start_time: {
        type: Date,
        required: [true, 'Start time is required']
    },
    end_time: {
        type: Date,
        required: [true, 'End time is required']
    },
    recurrence: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly'],
        default: 'none'
    },
    recurrence_end: {
        type: Date
    },
    recurrence_days: {
        type: [Number], // 0-6 (Sunday-Saturday)
        default: []
    },
    description: String,
    status: {
        type: String,
        enum: ['planned', 'completed', 'cancelled'],
        default: 'planned'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Create methods to easily populate category data
eventSchema.methods.populateEvent = async function () {
    return this.populate('user_id').populate('activity_id');
};

// Adding a virtual property to get user details when needed
eventSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
})

// Adding a virtual property to get user details when needed
eventSchema.virtual('activity', {
    ref: 'Activity',
    localField: 'activity_id',
    foreignField: '_id',
    justOne: true
})

// Use this approach to prevent model recompilation errors
export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)
