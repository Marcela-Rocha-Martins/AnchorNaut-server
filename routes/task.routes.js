const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Route to create a new task
router.post('/tasks', taskController.createTasks);

// Route to get all tasks for a specific project
router.get('/tasks/:projectId', taskController.getTasksByProject);

// Route to get a single task by its ID
router.get('/tasks/:taskId', taskController.getTaskById);

// Route to edit a task
router.put('/tasks/:taskId', taskController.editTask);

// Route to delete a task
router.delete('/tasks/:taskId', taskController.deleteTask);

// Route to add a new subtask to a task
router.post('/tasks/:taskId/subtasks', taskController.addSubTask);

// Route to edit a subtask
router.put('/tasks/:taskId/subtasks/:subTaskId', taskController.editSubTask);

// Route to delete a subtask
router.delete('/tasks/:taskId/subtasks/:subTaskId', taskController.deleteSubTask);

// Route to add a task to a project one at a time
router.post("/projects/:projectId/tasks", taskController.addTaskToProject);

// Route to get tasks based on selected date and project
router.get('/projects/:projectId/tasks', taskController.getTasksByDeadlineAndProject);

module.exports = router;
