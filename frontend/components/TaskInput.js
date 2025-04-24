import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onAdd({ id: uuidv4(), title: text, completed: false });
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="New task"
        value={text}
        onChangeText={setText}
      />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginVertical: 10 },
  input: { flex: 1, borderBottomWidth: 1, marginRight: 10 },
});
