const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['processing', 'complete'], default: 'processing' } // Added status field
});

const TodoModel = mongoose.model('todos', TodoSchema);
module.exports = TodoModel;
