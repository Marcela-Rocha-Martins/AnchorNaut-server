const Project = require("../models/Project.model");
const { Task, SubTask } = require("../models/Task.model");

const cloudinary = require("cloudinary").v2;
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
    const userId = req.payload._id; // Obter o userId do objeto req.payload

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

// Upload a photo to a project using Cloudinary
exports.uploadDocument = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save the public URL of the uploaded photo to the project's documents array
    project.documents.push(result.secure_url);
    await project.save();

    res.status(200).json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get all project documents (photos) by project ID
exports.getAllProjectDocuments = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado." });
    }

    // Retorna todas as fotos do moodboard do projeto
    res.json(project.documents);
  } catch (error) {
    console.error("Erro ao obter as fotos do projeto:", error);
    res.status(500).json({ error: "Erro ao obter as fotos do projeto." });
  }
};
