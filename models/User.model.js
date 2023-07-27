
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String },
  project:{ type: Schema.Types.ObjectId, ref: "Project" },
});

const User = mongoose.model ('User', userSchema);

module.exports = User;