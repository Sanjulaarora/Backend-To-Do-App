const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  percentile: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const Tests = new mongoose.model('tests', testSchema);

module.exports = Tests;