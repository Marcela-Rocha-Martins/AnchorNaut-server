const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Rota para criar uma nova tarefa
router.post('/tasks', taskController.createTasks);

// Rota para obter todas as tarefas de um projeto específico
router.get('/tasks/:projectId', taskController.getTasksByProject);

// Rota para obter uma task 
router.get('/tasks/:taskId', taskController.getTaskById);

// Rota para editar uma task
router.put('/tasks/:taskId', taskController.editTask);

// Rota para excluir uma task
router.delete('/tasks/:taskId', taskController.deleteTask);

// Rota para adicionar uma nova subtask a uma task
router.post('/tasks/:taskId/subtasks', taskController.addSubTask);

// Rota para editar uma subtask
router.put('/tasks/:taskId/subtasks/:subTaskId', taskController.editSubTask);

// Rota para excluir uma subtask
router.delete('/tasks/:taskId/subtasks/:subTaskId', taskController.deleteSubTask);

// Rota para adicionar uma task por vez
router.post("/projects/:projectId/tasks", taskController.addTaskToProject);

// Rota para obter as tarefas com base na data selecionada
router.get('/projects/:projectId/tasks', taskController.getTasksByDeadlineAndProject);

module.exports = router;
