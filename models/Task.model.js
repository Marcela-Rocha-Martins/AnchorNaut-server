const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  frequency: { type: String},
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  status: { type: String, enum: ["pending", "doing", "done"], default: "pending" },
  deadline: { type: Date },
  parentTask: { type: Schema.Types.ObjectId, ref: "Task" }, // Referência à tarefa pai
  subTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }] // Referências às tarefas filhas (subtasks)
});

const Task = model("Task", taskSchema);

module.exports = Task;