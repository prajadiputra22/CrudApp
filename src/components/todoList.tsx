import React, { useState } from 'react';
import { View, Text, Button, Modal, TextInput, StyleSheet } from 'react-native';

interface Todo {
  id: number;
  name: string;
  todo: string;
  description: string;
  date: Date; // pastikan ini tipe Date
}

interface TodoListProps {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  editTodo: (id: number, updatedTodo: Partial<Todo>) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todo, deleteTodo, editTodo }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(todo.name);
  const [editedTodo, setEditedTodo] = useState(todo.todo);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedDate, setEditedDate] = useState(
    todo.date instanceof Date && !isNaN(todo.date.getTime())
      ? todo.date.toISOString().split('T')[0]
      : '' // Set default if date is invalid
  );

  const handleEdit = () => {
    setEditModalVisible(true); // Tampilkan modal edit
  };

  const handleSaveEdit = () => {
    const updatedDate = new Date(editedDate);
    if (isNaN(updatedDate.getTime())) {
      console.error("Invalid date format");
      return;
    }

    // Panggil fungsi editTodo dengan data yang telah diperbarui
    editTodo(todo.id, {
      name: editedName,
      todo: editedTodo,
      description: editedDescription,
      date: updatedDate,
    });
    setEditModalVisible(false); // Tutup modal setelah disimpan
  };

  return (
    <View style={styles.todoContainer}>
      <Text>Name: {todo.name}</Text>
      <Text>Todo: {todo.todo}</Text>
      <Text>Description: {todo.description}</Text>
      <Text>
        Date: {todo.date instanceof Date && !isNaN(todo.date.getTime()) 
          ? todo.date.toDateString() 
          : "Invalid date"}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" color="#FFD700" onPress={handleEdit} /> 
        <Button title="Delete" color="#FF0000" onPress={() => deleteTodo(todo.id)} />
      </View>

      {/* Modal Edit */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Todo</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedName}
              onChangeText={setEditedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Todo"
              value={editedTodo}
              onChangeText={setEditedTodo}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={editedDescription}
              onChangeText={setEditedDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={editedDate}
              onChangeText={setEditedDate}
            />
            <Button title="Save" onPress={handleSaveEdit} />
            <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default TodoList;
