const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { 
    type: String, 
    enum: ['standard', 'admin'], 
    default: 'standard' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);