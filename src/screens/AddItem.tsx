import React from 'react';
import { View } from 'react-native';
import api from '../api/api';
import ItemForm from '../components/todoForm';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type AddItemScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddItem'>;

interface AddItemScreenProps {
  navigation: AddItemScreenNavigationProp;
}

const AddItemScreen: React.FC<AddItemScreenProps> = ({ navigation }) => {
  const handleSubmit = async (values: { name: string; description: string }) => {
    await api.post('/', values);
    navigation.goBack();
  };

  return (
    <View>
      <ItemForm initialValues={{ name: '', description: '' }} onSubmit={handleSubmit} />
    </View>
  );
};

export default AddItemScreen;
