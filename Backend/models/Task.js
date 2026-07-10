const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Task title is required'], 
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  assignedUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Task must be assigned to a user']
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Task must have a creator']
  }
}, { timestamps: true }); // Automatically handles Created Date via createdAt

module.exports = mongoose.model('Task', TaskSchema);