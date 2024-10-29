import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import api from '../api/api';
import ItemForm from '../components/todoForm';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type EditItemScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditItem'>;
type EditItemScreenRouteProp = RouteProp<RootStackParamList, 'EditItem'>;

interface EditItemScreenProps {
  navigation: EditItemScreenNavigationProp;
  route: EditItemScreenRouteProp;
}

const EditItemScreen: React.FC<EditItemScreenProps> = ({ navigation, route }) => {
  const { id } = route.params;
  const [item, setItem] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchItem = async () => {
      const response = await api.get(`/${id}`);
      setItem(response.data);
    };
    fetchItem();
  }, [id]);

  const handleSubmit = async (values: { name: string; description: string }) => {
    await api.put(`/${id}`, values);
    navigation.goBack();
  };

  return (
    <View>
      <ItemForm initialValues={item} onSubmit={handleSubmit} />
    </View>
  );
};

export default EditItemScreen;
