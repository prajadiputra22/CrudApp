import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

interface TodoFormProps {
  addTodo: (todo: { name: string; todo: string; description: string; date: Date }) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  const [name, setName] = useState('');
  const [todo, setTodo] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date()); // Default sebagai objek Date

  const handleAddTodo = () => {
    if (name && todo && description) {
      addTodo({ name, todo, description, date });
      setName('');
      setTodo('');
      setDescription('');
      setDate(new Date()); // Reset date ke saat ini
    }
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Todo" value={todo} onChangeText={setTodo} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} />

      <Button title="Add Todo" onPress={handleAddTodo} />
    </View>
  );
};

export default TodoForm;
