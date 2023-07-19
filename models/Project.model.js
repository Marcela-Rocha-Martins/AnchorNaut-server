const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  steps: [{ type: String }],
  todos: [{
    text: { type: String, required: true },
    status: { type: String, enum: ['pending', 'doing', 'done'], default: 'pending' },
    date: { type: Date },
  }],
  documents: [{ type: String }],
  deadline: { type: Date },
  frequency: { type: String },
  completionRate: { type: Number, default: 0 },
});

projectSchema.statics.calculateCompletionRate = async function(projectId) {
  const project = await this.findById(projectId).exec();
  const totalTodos = project.todos.length;
  const doneTodos = project.todos.filter(todo => todo.status === 'done').length;
  const completionRate = totalTodos > 0 ? (doneTodos / totalTodos) * 100 : 0;

  project.completionRate = completionRate;
  await project.save();

  return completionRate;
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
