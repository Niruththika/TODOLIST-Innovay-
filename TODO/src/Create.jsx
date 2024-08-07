import React, { useState } from 'react';
import axios from 'axios';

function Create() {
    const [task, setTask] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('processing'); // Default status

    const handleAdd = () => {
        axios.post('http://localhost:3001/add', { task, date, status })
            .then(result => {
                console.log(result);
                // Clear form fields after successful addition
                setTask('');
                setDate('');
                setStatus('processing'); // Reset to default
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='create_form'>
            <input
                type='text'
                placeholder='Enter the task'
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <select className='create-form'
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value='processing'>Processing</option>
                <option value='complete'>Complete</option>
            </select>
            <button type='button' onClick={handleAdd}>Add</button>
        </div>
    );
}

export default Create;
