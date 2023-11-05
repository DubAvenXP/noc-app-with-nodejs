import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'info'
  },
  message: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

export const logModel = mongoose.model('Log', logSchema);
