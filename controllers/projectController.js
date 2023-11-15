const Project = require("../models/Project.model");
const { Task, SubTask } = require("../models/Task.model");

const fs = require("fs");

// Controller function to create a project
exports.createProject = async (req, res) => {
  try {
    const { projectName, tasksId, user } = req.body;

    const newProject = await Project.create({
      projectName: projectName,
      tasks: tasksId,
      user: user, // Associate the project with the user ID
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error("Erro ao criar o projeto:", error);
    return res.status(500).json({ error: "Erro ao criar o projeto." });
  }
};

// Controller function to get a list of all projects
exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.payload._id; 

    const projects = await Project.find({ user: userId }).populate("tasks");
    res.json(projects);
  } catch (error) {
    console.error("Erro ao obter a lista de projetos:", error);
    res.status(500).json({ error: "Erro ao obter a lista de projetos." });
  }
};

// Controller function to get a project by its ID
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId)
      .populate({
        path: 'tasks',
        populate: {
          path: 'subTasks',
          model: 'SubTask',
        },
      });
    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado." });
    }
    res.json(project);
  } catch (error) {
    console.error("Erro ao obter o projeto:", error);
    res.status(500).json({ error: "Erro ao obter o projeto." });
  }
};

exports.updateProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { projectName, tasksId, description } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        projectName: projectName,
        tasks: tasksId,
        description: description,
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Projeto não encontrado." });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error("Erro ao atualizar o projeto:", error);
    res.status(500).json({ error: "Erro ao atualizar o projeto." });
  }
};
// Controller function to delete a project by its ID
exports.deleteProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ error: "Projeto não encontrado." });
    }

    res.json({ message: "Projeto deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar o projeto:", error);
    res.status(500).json({ error: "Erro ao deletar o projeto." });
  }
};
