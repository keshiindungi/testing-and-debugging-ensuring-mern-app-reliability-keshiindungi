import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reporter: {
    type: String,
    required: true,
    trim: true
  },
  assignee: {
    type: String,
    trim: true,
    default: ''
  },
  stepsToReproduce: [String],
  environment: {
    os: String,
    browser: String,
    version: String
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
bugSchema.index({ status: 1, priority: -1 });
bugSchema.index({ createdAt: -1 });

export default mongoose.model('Bug', bugSchema);