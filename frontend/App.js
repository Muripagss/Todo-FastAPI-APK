import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000";

const lightModeStyles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '10px auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '1.8rem',
    marginBottom: '10px',
    color: '#333',
  },
  inputWrapper: {
    display: 'flex',
    marginBottom: '10px',
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginRight: '10px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '0.9rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  taskList: {
    marginTop: '10px',
  },
  taskItem: {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ccc',
  },
  taskText: {
    fontSize: '1rem',
    color: '#333',
    flex: 1,
    marginLeft: '10px',
  },
  completed: {
    textDecoration: 'line-through',
    color: '#888',
  },
  taskActions: {
    display: 'flex',
    gap: '5px',
  },
};

const darkModeStyles = {
  ...lightModeStyles,
  container: { ...lightModeStyles.container, backgroundColor: '#333', color: '#fff' },
  header: { ...lightModeStyles.header, color: '#fff' },
  taskItem: { ...lightModeStyles.taskItem, backgroundColor: '#444', border: '1px solid #666' },
  taskText: { ...lightModeStyles.taskText, color: '#fff' },
  completed: { ...lightModeStyles.completed, color: '#aaa' },
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState('');

  const styles = isDarkMode ? darkModeStyles : lightModeStyles;

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE}/tasks`);
      let filteredTasks = response.data;
      if (filter === 'completed') filteredTasks = filteredTasks.filter(t => t.completed);
      else if (filter === 'incomplete') filteredTasks = filteredTasks.filter(t => !t.completed);
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!taskInput) return;
    try {
      const newTask = { title: taskInput, completed: false };
      const response = await axios.post(`${API_BASE}/tasks`, newTask);
      setTasks([...tasks, response.data]);
      setTaskInput('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const updatedTask = { ...task, completed: !task.completed };
    await axios.put(`${API_BASE}/tasks/${taskId}`, updatedTask);
    setTasks(tasks.map(t => (t.id === taskId ? updatedTask : t)));
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`${API_BASE}/tasks/${taskId}`);
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditInput(task.title);
  };

  const saveEdit = async (taskId) => {
    try {
      const updatedTask = { ...tasks.find(t => t.id === taskId), title: editInput };
      await axios.put(`${API_BASE}/tasks/${taskId}`, updatedTask);
      setTasks(tasks.map(t => (t.id === taskId ? updatedTask : t)));
      setEditingId(null);
      setEditInput('');
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Task List</h1>

      <div style={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Add a new task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={addTask} style={styles.button}>Add</button>
      </div>

      <div style={styles.actionRow}>
        <div style={styles.buttonGroup}>
          <button onClick={() => setFilter('all')} style={styles.button}>All</button>
          <button onClick={() => setFilter('completed')} style={styles.button}>Completed</button>
          <button onClick={() => setFilter('incomplete')} style={styles.button}>Pending</button>
        </div>
        <button onClick={toggleDarkMode} style={styles.button}>
          {isDarkMode ? '🌙' : '☀️'}
        </button>
      </div>

      <div style={styles.taskList}>
        {tasks.map((task) => (
          <div key={task.id} style={styles.taskItem}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {editingId === task.id ? (
              <>
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  style={{ ...styles.input, marginLeft: '10px' }}
                />
                <div style={styles.taskActions}>
                  <button onClick={() => saveEdit(task.id)} style={styles.button}>Save</button>
                  <button onClick={() => setEditingId(null)} style={styles.button}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <span style={{ ...styles.taskText, ...(task.completed ? styles.completed : {}) }}>
                  {task.title}
                </span>
                <div style={styles.taskActions}>
                  <button onClick={() => startEditing(task)} style={styles.button}>Edit</button>
                  <button onClick={() => deleteTask(task.id)} style={styles.button}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
