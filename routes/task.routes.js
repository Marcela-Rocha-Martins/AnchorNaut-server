const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Rota para criar uma nova tarefa
router.post('/tasks', taskController.createTasks);

module.exports = router;
