import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';
import TodoForm from './src/components/todoForm';
import TodoList from './src/components/todoList';

const API_URL = 'https://671f7dd1e7a5792f052e711f.mockapi.io/todoapp/user';

interface Todo {
  id: number;
  name: string;
  todo: string;
  description: string;
  date: Date;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      const todosWithDate = response.data.map((todo: any) => ({
        ...todo,
        date: new Date(todo.date),
      }));
      setTodos(todosWithDate);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (todo: { name: string; todo: string; description: string; date: Date }) => {
    try {
      const response = await axios.post(API_URL, {
        ...todo,
        date: todo.date.toISOString(),
      });
      setTodos((prev) => [...prev, { ...response.data, date: new Date(response.data.date) }]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const editTodo = async (id: number, updatedTodo: Partial<Todo>) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        ...updatedTodo,
        date: updatedTodo.date ? updatedTodo.date.toISOString() : undefined,
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...response.data } : todo))
      );
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TodoForm addTodo={addTodo} />
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoList todo={item} deleteTodo={deleteTodo} editTodo={editTodo} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default App;
