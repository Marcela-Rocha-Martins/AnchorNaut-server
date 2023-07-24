const { Task, SubTask } = require("../models/Task.model");
const Project = require("../models/Project.model");

exports.createTasks = async (req, res) => {
  try {
    const formattedTasks = req.body;
    const tasks = [];

    // Para cada tarefa formatada, crie uma nova tarefa no banco de dados
    for (const formattedTask of formattedTasks) {
      const task = new Task({
        task: formattedTask.task,
        estimatedTime: formattedTask.estimatedTime,
        project: formattedTask.project,
        status: formattedTask.status,
        deadline: formattedTask.deadline,
      });

      // Para cada subtarefa formatada, crie uma nova subtarefa no banco de dados e adicione-a à tarefa
      for (const formattedSubTask of formattedTask.subtasks) {
        const subTask = new SubTask({
          subTask: formattedSubTask.subtask,
          estimatedTime: formattedSubTask.estimatedTime,
          status: "pending",
          task: task._id,
        });

        await subTask.save();
        task.subTasks.push(subTask._id);
      }

      await task.save();
      tasks.push(task);
    }

    // Obtenha todas as IDs das tarefas criadas
    const taskIds = tasks.map((task) => task._id);

    // Atualize o projeto para adicionar as IDs das tarefas criadas
    await Project.findByIdAndUpdate(formattedTasks[0].project, {
      $push: { tasks: { $each: taskIds } },
    });

    res.status(201).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao criar as tarefas.");
  }
};
