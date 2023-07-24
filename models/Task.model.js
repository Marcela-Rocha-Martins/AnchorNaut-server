const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const subTaskSchema = new Schema({
  subTask: { type: String, required: true },
  estimatedTime: { type: String },
  status: { type: String, enum: ["pending", "doing", "done"], default: "pending" },
  task: [{ type: Schema.Types.ObjectId, ref: "Task" }], // Referência para o esquema das tarefas
});

const taskSchema = new Schema({
  task: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  status: { type: String, enum: ["pending", "doing", "done"], default: "pending" },
  deadline: { type: Date },
  subTasks: [{ type: Schema.Types.ObjectId, ref: "SubTask" }], // Referência para o esquema das subtarefas
});

const Task = model("Task", taskSchema);
const SubTask = model("SubTask", subTaskSchema);

module.exports = { Task, SubTask };

