 import mongoose from 'mongoose'

const weeklyScheduleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  time: {
    type: String, // Store as "HH:MM" format
    required: [true, 'Time is required']
  },
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: [true, 'Activity ID is required']
  },
  is_recurring: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// Compound index to ensure a user doesn't schedule two activities at the same time on the same day
weeklyScheduleSchema.index({ user_id: 1, day: 1, time: 1 }, { unique: true })

export const WeeklySchedule = mongoose.models.WeeklySchedule || mongoose.model('WeeklySchedule', weeklyScheduleSchema)
