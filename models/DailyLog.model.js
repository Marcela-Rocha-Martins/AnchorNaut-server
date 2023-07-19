const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const dailyLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  title: { type: String },
  entry: { type: String, required: true },
  photo: { type: String },
  audio: { type: String },
  mood: { type: Number },
  tags: [{ type: String }],
});

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);

module.exports = DailyLog;