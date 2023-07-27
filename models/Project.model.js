const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  description: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  documents: [{ type: String }],
  deadlineProject: { type: Date },
  completionRate: { type: Number, default: 0 },
});

module.exports = model("Project", projectSchema);