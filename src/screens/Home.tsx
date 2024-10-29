import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import api from '../api/api';
import ItemList from '../components/todoList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const response = await api.get('/');
    setItems(response.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id: number) => {
    await api.delete(`/${id}`);
    fetchItems();
  };

  return (
    <View>
      <Button title="Add Item" onPress={() => navigation.navigate('AddItem')} />
      <ItemList items={items} onEdit={(id) => navigation.navigate('EditItem', { id })} onDelete={deleteItem} />
    </View>
  );
};

export default HomeScreen;
