const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../models/Project.model");
const Task = require("../models/Task.model");
const projectController = require("../controllers/projectController");

// Route to create a project
router.post("/projects", projectController.createProject);

// Route to get a list of all projects
router.get("/projects", projectController.getAllProjects);

// Route to get a project by its ID
router.get("/projects/:id", projectController.getProjectById);

module.exports = router;

// // POST /api/projects - Creates a new project
// router.post("/projects", async (req, res, next) => {
//   try {
//     const { name, description, user, deadlineProject, completionRate } = req.body;

//     const project = new Project({
//       name,
//       description,
//       user,
//       todos: [], // Nenhum item de "todos" é criado aqui, pois será populado ao criar tarefas relacionadas
//       documents: [], // Nenhum item de "documents" é criado aqui, pode ser populado ao adicionar documentos futuramente
//       deadlineProject,
//       completionRate: completionRate || 0, // Valor padrão para completionRate é 0, se não for fornecido no body da requisição
//     });

//     await project.save();

//     res.json(project);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create a new project" });
//   }
// });

// // GET /api/projects - Retrieves all of the projects
// router.get("/projects", async (req, res, next) => {
//   try {
//     const allProjects = await Project.find().populate("todos");

//     res.json(allProjects);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve projects" });
//   }
// });

// // GET /api/projects/:projectId - Retrieves a specific project by id
// router.get("/projects/:projectId", async (req, res, next) => {
//   try {
//     const { projectId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ message: "Specified id is not valid" });
//       return;
//     }

//     const project = await Project.findById(projectId).populate("todos");

//     if (!project) {
//       res.status(404).json({ message: "Project not found" });
//       return;
//     }

//     res.status(200).json(project);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve the project" });
//   }
// });

// // PUT /api/projects/:projectId - Updates a specific project by id
// router.put("/projects/:projectId", async (req, res, next) => {
//   try {
//     const { projectId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ message: "Specified id is not valid" });
//       return;
//     }

//     const updatedProject = await Project.findByIdAndUpdate(
//       projectId,
//       req.body,
//       { new: true }
//     );

//     if (!updatedProject) {
//       res.status(404).json({ message: "Project not found" });
//       return;
//     }

//     res.json(updatedProject);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update the project" });
//   }
// });

// // DELETE /api/projects/:projectId - Deletes a specific project by id
// router.delete("/projects/:projectId", async (req, res, next) => {
//   try {
//     const { projectId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ message: "Specified id is not valid" });
//       return;
//     }

//     const deletedProject = await Project.findByIdAndRemove(projectId);

//     if (!deletedProject) {
//       res.status(404).json({ message: "Project not found" });
//       return;
//     }

//     res.json({
//       message: `Project with ID ${projectId} has been successfully deleted.`,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete the project" });
//   }
// });

// module.exports = router;