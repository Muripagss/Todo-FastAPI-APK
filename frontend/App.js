import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import axios from 'axios';

const API_BASE = 'https://todo-fastapi-apk.onrender.com';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState('');

  const styles = createStyles(isDarkMode);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE}/tasks`);
      let filtered = response.data;
      if (filter === 'completed') filtered = filtered.filter(t => t.completed);
      else if (filter === 'incomplete') filtered = filtered.filter(t => !t.completed);
      setTasks(filtered);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const addTask = async () => {
    if (!taskInput) return;
    try {
      const response = await axios.post(`${API_BASE}/tasks`, { title: taskInput, completed: false });
      setTasks([...tasks, response.data]);
      setTaskInput('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const toggleTaskCompletion = async (id) => {
    const task = tasks.find(t => t.id === id);
    const updated = { ...task, completed: !task.completed };
    await axios.put(`${API_BASE}/tasks/${id}`, updated);
    setTasks(tasks.map(t => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_BASE}/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditInput(task.title);
  };

  const saveEdit = async (id) => {
    const updated = { ...tasks.find(t => t.id === id), title: editInput };
    await axios.put(`${API_BASE}/tasks/${id}`, updated);
    setTasks(tasks.map(t => (t.id === id ? updated : t)));
    setEditingId(null);
    setEditInput('');
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>To-Do List</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Add a new task"
          placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
          value={taskInput}
          onChangeText={setTaskInput}
          style={styles.input}
        />
        <Button title="Add" onPress={addTask} color={isDarkMode ? '#0af' : '#007bff'} />
      </View>

      <View style={styles.actionRow}>
        <View style={styles.buttonGroup}>
          <Button title="All" onPress={() => setFilter('all')} />
          <Button title="Completed" onPress={() => setFilter('completed')} />
          <Button title="Pending" onPress={() => setFilter('incomplete')} />
        </View>
        <Button title={isDarkMode ? '🌙Dark Mode' : '☀️Light Mode'} onPress={toggleDarkMode} />
      </View>

      <View>
        {tasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <TouchableOpacity
              onPress={() => toggleTaskCompletion(task.id)}
              style={[styles.checkbox, task.completed && styles.checkboxChecked]}
            >
              {task.completed && <Text style={styles.checkmark}>✔</Text>}
            </TouchableOpacity>

            {editingId === task.id ? (
              <>
                <TextInput
                  value={editInput}
                  onChangeText={setEditInput}
                  style={styles.input}
                />
                <Button title="Save" onPress={() => saveEdit(task.id)} />
                <Button title="Cancel" onPress={() => setEditingId(null)} />
              </>
            ) : (
              <>
                <Text style={[styles.taskText, task.completed && styles.completed]}>
                  {task.title}
                </Text>
                <View style={styles.taskActions}>
                  <Button title="Edit" onPress={() => startEditing(task)} />
                  <Button title="Delete" onPress={() => deleteTask(task.id)} />
                </View>
              </>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function createStyles(isDarkMode) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      paddingTop: 40,
      backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? '#fff' : '#333',
      textAlign: 'center',
    },
    inputWrapper: {
      flexDirection: 'row',
      marginBottom: 15,
      gap: 10,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: Platform.OS === 'ios' ? 10 : 5,
      color: isDarkMode ? '#fff' : '#000',
      backgroundColor: isDarkMode ? '#333' : '#fff',
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 5,
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#444' : '#fff',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: isDarkMode ? '#666' : '#ccc',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: isDarkMode ? '#888' : '#555',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: isDarkMode ? '#0af' : '#007bff',
    },
    checkmark: {
      color: '#fff',
      fontWeight: 'bold',
    },
    taskText: {
      flex: 1,
      fontSize: 16,
      marginLeft: 10,
      color: isDarkMode ? '#fff' : '#333',
    },
    completed: {
      textDecorationLine: 'line-through',
      color: isDarkMode ? '#aaa' : '#888',
    },
    taskActions: {
      flexDirection: 'row',
      gap: 5,
    },
  });
}
