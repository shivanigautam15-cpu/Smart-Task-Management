const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

// All task routes require an authenticated token
router.use(authenticate);

router.route('/')
  .post(createTask)
  .get(getTasks);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
