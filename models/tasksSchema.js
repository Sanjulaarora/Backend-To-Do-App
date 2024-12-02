const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  priority: {
    type: Number,
    required: true,
    min: 1, // Optional: You can set a minimum priority value
    max: 5,
  },
  status: {
    type: String,
    required:true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
});

const Tasks = new mongoose.model('tasks', taskSchema);

module.exports = Tasks;