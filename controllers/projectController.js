// controllers/projectController.js
const Project = require("../models/Project.model");

// Controller function to create a project
exports.createProject = async (req, res) => {
  try {
    // Extrair o projectName e tasks do corpo da solicitação (req.body)
    const { projectName, tasksId } = req.body;

    // Crie o novo projeto no banco de dados
    const newProject = await Project.create({
      projectName: projectName,
      tasks: tasksId, // Aqui, as tasks serão passadas diretamente do frontend
    });

    // Resposta de sucesso com o novo projeto criado
    return res.status(201).json(newProject);
  } catch (error) {
    console.error("Erro ao criar o projeto:", error);
    return res.status(500).json({ error: "Erro ao criar o projeto." });
  }
};

// Controller function to get a list of all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
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
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado." });
    }
    res.json(project);
  } catch (error) {
    console.error("Erro ao obter o projeto:", error);
    res.status(500).json({ error: "Erro ao obter o projeto." });
  }
};