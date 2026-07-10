const Task = require('../models/Task');


exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedUser } = req.body;
    
    const task = new Task({
      title,
      description,
      status,
      priority,
      assignedUser: assignedUser || req.user.id, 
      creator: req.user.id
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
       filter = { $or: [{ assignedUser: req.user.id }, { creator: req.user.id }] };
    }

    const tasks = await Task.find(filter).populate('assignedUser', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

 
    if (req.user.role !== 'admin' && task.assignedUser.toString() !== req.user.id && task.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    
    if (req.user.role !== 'admin' && task.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
