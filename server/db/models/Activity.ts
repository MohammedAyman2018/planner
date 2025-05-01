import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, 'Activity name is required']
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category ID is required']
    }
}, { timestamps: true })

// Create methods to easily populate category data
activitySchema.methods.populateCategory = async function () {
    return this.populate('category_id').populate('user_id');
};

// Adding a virtual property to get category details when needed
activitySchema.virtual('category', {
    ref: 'Category',
    localField: 'category_id',
    foreignField: '_id',
    justOne: true
});

// Adding a virtual property to get user details when needed
activitySchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
})

// Make virtuals available in JSON output
activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema)
