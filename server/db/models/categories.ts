import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: String,
    icon: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Create methods to easily populate category data
categorySchema.methods.populateCategory = async function () {
    return this.populate('user_id');
};

// Adding a virtual property to get user details when needed
categorySchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
})
// Use this approach to prevent model recompilation errors
export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
