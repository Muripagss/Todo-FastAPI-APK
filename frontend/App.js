import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Switch, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const API_BASE = "https://todo-fastapi-apk.onrender.com";

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task List</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          value={taskInput}
          onChangeText={setTaskInput}
        />
        <TouchableOpacity onPress={addTask} style={styles.button}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => setFilter('all')} style={styles.button}><Text style={styles.buttonText}>All</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('completed')} style={styles.button}><Text style={styles.buttonText}>Completed</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('incomplete')} style={styles.button}><Text style={styles.buttonText}>Pending</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.button}>
          <Text style={styles.buttonText}>{isDarkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        style={styles.taskList}
        renderItem={({ item: task }) => (
          <View style={styles.taskItem}>
            <Switch
              value={task.completed}
              onValueChange={() => toggleTaskCompletion(task.id)}
            />
            {editingId === task.id ? (
              <>
                <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 10 }]}
                  value={editInput}
                  onChangeText={setEditInput}
                />
                <View style={styles.taskActions}>
                  <TouchableOpacity onPress={() => saveEdit(task.id)} style={styles.button}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingId(null)} style={styles.button}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.taskText, task.completed && styles.completed]}>
                  {task.title}
                </Text>
                <View style={styles.taskActions}>
                  <TouchableOpacity onPress={() => startEditing(task)} style={styles.button}><Text style={styles.buttonText}>Edit</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.button}><Text style={styles.buttonText}>Delete</Text></TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const sharedStyles = {
  inputWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  taskItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 5,
  },
};

const lightModeStyles = StyleSheet.create({
  container: {
    maxWidth: 600,
    marginHorizontal: 'auto',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    flex: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  ...sharedStyles,
  input: {
    ...sharedStyles.input,
    borderColor: '#ccc',
    color: '#000',
  },
  taskItem: {
    ...sharedStyles.taskItem,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  taskText: {
    ...sharedStyles.taskText,
    color: '#333',
  },
  completed: {
    ...sharedStyles.completed,
    color: '#888',
  },
});

const darkModeStyles = StyleSheet.create({
  ...lightModeStyles,
  container: {
    ...lightModeStyles.container,
    backgroundColor: '#333',
  },
  header: {
    ...lightModeStyles.header,
    color: '#fff',
  },
  input: {
    ...lightModeStyles.input,
    color: '#fff',
    borderColor: '#666',
  },
  taskItem: {
    ...lightModeStyles.taskItem,
    backgroundColor: '#444',
    borderColor: '#666',
  },
  taskText: {
    ...lightModeStyles.taskText,
    color: '#fff',
  },
  completed: {
    ...lightModeStyles.completed,
    color: '#aaa',
  },
});
