const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  todos: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  documents: [{ type: String }],
  deadlineProject: { type: Date },
  completionRate: { type: Number, default: 0 },
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;


// todos: [{
  //   text: { type: String, required: true },
  //   status: { type: String, enum: ['pending', 'doing', 'done'], default: 'pending' },
  //   date: { type: Date },
  // }],


// projectSchema.statics.calculateCompletionRate = async function(projectId) {
//   const project = await this.findById(projectId).exec();
//   const totalTodos = project.todos.length;
//   const doneTodos = project.todos.filter(todo => todo.status === 'done').length;
//   const completionRate = totalTodos > 0 ? (doneTodos / totalTodos) * 100 : 0;

//   project.completionRate = completionRate;
//   await project.save();

//   return completionRate;
// };
