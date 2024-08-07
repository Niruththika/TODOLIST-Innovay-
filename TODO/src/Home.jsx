import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsFillTrashFill, BsPencil } from 'react-icons/bs';
import './Home.css';

function Home() {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTask, setEditTask] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editStatus, setEditStatus] = useState('processing');
    const [currentTodoId, setCurrentTodoId] = useState(null);

    useEffect(() => {
        // Fetch todos from the backend
        axios.get('http://localhost:3001/get')
            .then(response => setTodos(response.data))
            .catch(err => {
                console.error('Error fetching todos:', err);
                setError('Failed to fetch todos.');
            });
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => {
                setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
            })
            .catch(err => {
                console.error('Error deleting todo:', err);
                setError('Failed to delete todo.');
            });
    };

    const handleEdit = (id, task, date, status) => {
        setIsEditing(true);
        setEditTask(task);
        setEditDate(date ? new Date(date).toISOString().split('T')[0] : ''); // Format date
        setEditStatus(status);
        setCurrentTodoId(id);
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:3001/update/${currentTodoId}`, { task: editTask, date: editDate, status: editStatus })
            .then(() => {
                setTodos(prevTodos => prevTodos.map(todo =>
                    todo._id === currentTodoId ? { ...todo, task: editTask, date: editDate, status: editStatus } : todo
                ));
                resetEditing();
            })
            .catch(err => {
                console.error('Error updating todo:', err);
                setError('Failed to update todo.');
            });
    };

    const resetEditing = () => {
        setIsEditing(false);
        setEditTask('');
        setEditDate('');
        setEditStatus('processing');
        setCurrentTodoId(null);
    };

    return (
        <div className='home'>
            <h2>Todo List</h2>
            <Create />
            {error && <div className='error-message'><h2>{error}</h2></div>}
            {todos.length === 0 && !error && <div><h2>No Records</h2></div>}
            {todos.length > 0 && !error && todos.map(todo => (
                <div key={todo._id} className='task'>
                    <span>{todo.task}</span>
                    <span>{new Date(todo.date).toLocaleDateString()}</span>
                    <span>Status: {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}</span>
                    <div className='task-actions'>
                        <button
                            onClick={() => handleEdit(todo._id, todo.task, todo.date, todo.status)}
                            className='edit-btn'
                            aria-label="Edit"
                        >
                            <BsPencil className='icon' />
                        </button>
                        <button
                            onClick={() => handleDelete(todo._id)}
                            className='delete-btn'
                            aria-label="Delete"
                        >
                            <BsFillTrashFill className='icon' />
                        </button>
                    </div>
                </div>
            ))}
            {isEditing && (
                <div className='edit-form'>
                    <h3>Edit Todo</h3>
                    <input
                        type='text'
                        value={editTask}
                        onChange={(e) => setEditTask(e.target.value)}
                        placeholder='Edit task'
                    />
                    <input
                        type='date'
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder='Select date'
                    />
                    <select 
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                    >
                        <option value='processing'>Processing</option>
                        <option value='complete'>Complete</option>
                    </select>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={resetEditing}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Home;
