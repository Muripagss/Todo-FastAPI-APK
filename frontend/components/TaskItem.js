import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TaskItem({ task, onDelete, onToggle, onEdit }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle}>
        <MaterialIcons 
          name={task.completed ? "check-box" : "check-box-outline-blank"} 
          size={24} color="black" 
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.textContainer} onPress={onEdit}>
        <Text style={[styles.text, task.completed && styles.completed]}>
          {task.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  textContainer: { flex: 1, marginLeft: 10 },
  text: { fontSize: 16 },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
});
