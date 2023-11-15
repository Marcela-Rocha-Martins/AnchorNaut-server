const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Route to create a project
router.post("/projects", projectController.createProject);

// Route to get a list of all projects
router.get("/projects", projectController.getAllProjects);

// Route to get a project by its ID
router.get("/projects/:id", projectController.getProjectById);

// Rota para atualizar um projeto
router.put("/projects/:id", projectController.updateProjectById); 

// Rota para deletar um projeto pelo ID
router.delete("/projects/:id", projectController.deleteProjectById);

module.exports = router;