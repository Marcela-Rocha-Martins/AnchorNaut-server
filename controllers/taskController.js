const { Task, SubTask } = require("../models/Task.model");
const Project = require("../models/Project.model");
const { ObjectId } = require("mongoose").Types;

exports.createTasks = async (req, res) => {
  try {
    const formattedTasks = req.body;
    const tasks = [];

   
    for (const formattedTask of formattedTasks) {
      const task = new Task({
        task: formattedTask.task,
        estimatedTime: formattedTask.estimatedTime,
        project: formattedTask.project,
        status: formattedTask.status,
        deadline: formattedTask.deadline,
      });

     
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


    const taskIds = tasks.map((task) => task._id);

    await Project.findByIdAndUpdate(formattedTasks[0].project, {
      $push: { tasks: { $each: taskIds } },
    });

    res.status(201).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao criar as tarefas.");
  }
};

exports.addTaskToProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const formattedTask = req.body;

    const task = new Task({
      task: formattedTask.task,
      estimatedTime: formattedTask.estimatedTime,
      project: projectId,
      status: formattedTask.status,
      deadline: formattedTask.deadline,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao criar a tarefa.");
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await Task.find({ project: projectId }).populate({
      path: "subTasks",
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao obter as tarefas do projeto.");
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId).populate("subTasks");
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao obter a tarefa.");
  }
};


exports.editTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;


    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return res.status(404).send("Tarefa não encontrada.");
    }

   
    if (req.body.task) {
      existingTask.task = req.body.task;
    }
    if (req.body.estimatedTime) {
      existingTask.estimatedTime = req.body.estimatedTime;
    }
    if (req.body.status) {
      existingTask.status = req.body.status;
    }
    if (req.body.deadline) {
      existingTask.deadline = req.body.deadline;
    }

    await existingTask.save();

    res.status(200).send("Tarefa editada com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao editar a tarefa.");
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return res.status(404).send("Tarefa não encontrada.");
    }


    await existingTask.remove();

    res.status(200).send("Tarefa excluída com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao excluir a tarefa.");
  }
};

exports.addSubTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { subTask, estimatedTime } = req.body;

    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return res.status(404).send("Tarefa não encontrada.");
    }


    const newSubTask = new SubTask({
      subTask,
      estimatedTime: estimatedTime || "null",
      status: "pending",
      task: taskId,
    });

    await newSubTask.save();
    existingTask.subTasks.push(newSubTask._id);


    await existingTask.save();

    res.status(201).send("Subtarefa adicionada com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};


exports.editSubTask = async (req, res) => {
  try {
    const subTaskId = req.params.subTaskId;


    const existingSubTask = await SubTask.findById(subTaskId);

    if (!existingSubTask) {
      return res.status(404).send("Subtarefa não encontrada.");
    }

    if (req.body.subTask) {
      existingSubTask.subTask = req.body.subTask;
    }
    if (req.body.estimatedTime) {
      existingSubTask.estimatedTime = req.body.estimatedTime;
    }
    if (req.body.status) {
      existingSubTask.status = req.body.status;
    }
    if (req.body.deadline) {
      existingSubTask.deadline = req.body.deadline;
    }

    await existingSubTask.save();

    res.status(200).send("Subtarefa editada com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao editar a subtarefa.");
  }
};

exports.deleteSubTask = async (req, res) => {
  try {
    const subTaskId = req.params.subTaskId;

    const existingSubTask = await SubTask.findById(subTaskId);

    if (!existingSubTask) {
      return res.status(404).send("Subtarefa não encontrada.");
    }

    await existingSubTask.remove();

    res.status(200).send("Subtarefa excluída com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao excluir a subtarefa.");
  }
};


exports.getTasksByDeadlineAndProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    console.log("Received projectId:", projectId);

    const selectedDate = new Date(req.query.date);
    console.log("Received date:", selectedDate);

    const startOfDate = new Date(selectedDate);
    startOfDate.setUTCHours(0, 0, 0, 0);

    const endOfDate = new Date(selectedDate);
    endOfDate.setUTCHours(23, 59, 59, 999);

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send("Project not found.");
    }

    const tasks = await Task.find({
      project: ObjectId(projectId),
      deadline: {
        $gte: startOfDate,
        $lte: endOfDate,
      },
    }).populate("subTasks");

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tasks by deadline within the project.");
  }
};

