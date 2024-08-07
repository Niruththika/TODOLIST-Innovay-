const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo'); // Ensure this path is correct

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// GET /get - Fetch all todos
app.get('/get', async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /add - Create a new todo

app.post('/add', async (req, res) => {
    const { task, date, status } = req.body; // Get status from request body

    try {
        const newTodo = new TodoModel({ task, date, status }); // Include status in creation
        const result = await newTodo.save();
        res.json(result);
    } catch (err) {
        console.error('Error saving task:', err);
        res.status(500).json({ error: err.message });
    }
});


// DELETE /delete/:id - Delete a todo by ID
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await TodoModel.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: 'Todo deleted successfully' });
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /update/:id - Update a todo by ID
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { task, date } = req.body; // Include date field

    try {
        const result = await TodoModel.findByIdAndUpdate(id, { task, date }, { new: true });
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
