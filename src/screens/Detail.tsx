import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RouteParams = {
  Detail: {
    id: string;
    judul: string;
    tahun: number;
    genre: string;
    image: string;
    jumlah_episode: number;
    durasi: number;
    studio: string;
    status: string;
    sinopsis: string;
  };
};

type DetailScreenProps = NativeStackScreenProps<RouteParams, 'Detail'>;

const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { id, judul, tahun, genre, image, jumlah_episode, durasi, studio, status, sinopsis } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedJudul, setEditedJudul] = useState(judul);
  const [editedTahun, setEditedTahun] = useState(tahun.toString());
  const [editedGenre, setEditedGenre] = useState(genre);
  const [editedImage, setEditedImage] = useState(image);
  const [editedJumlahEpisode, setEditedJumlahEpisode] = useState(jumlah_episode.toString());
  const [editedDurasi, setEditedDurasi] = useState(durasi.toString());
  const [editedStudio, setEditedStudio] = useState(studio);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedSinopsis, setEditedSinopsis] = useState(sinopsis);
  const [refreshing, setRefreshing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedInfo = {
        judul: editedJudul,
        tahun: parseInt(editedTahun),
        genre: editedGenre,
        status: editedStatus,
        image: editedImage,
        sinopsis: editedSinopsis,
      };
  
      const updatedDetail = {
        jumlah_episode: parseInt(editedJumlahEpisode),
        durasi: parseInt(editedDurasi),
        studio: editedStudio,
      };

      await Promise.all([
        axios.put(`https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar/${id}`, updatedInfo),
        axios.put(`https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail/${id}`, updatedDetail),
      ]);
  
      Alert.alert('Success', 'Data updated successfully');
      setIsEditing(false);

      navigation.setParams({
        judul: editedJudul,
        tahun: parseInt(editedTahun),
        genre: editedGenre,
        image: editedImage,
        jumlah_episode: parseInt(editedJumlahEpisode),
        durasi: parseInt(editedDurasi),
        studio: editedStudio,
        status: editedStatus,
        sinopsis: editedSinopsis,
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to update data');
    }
  };
  
  const handleDelete = async () => {
    try {
      await Promise.all([
        axios.delete(`https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar/${id}`),
        axios.delete(`https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail/${id}`),
      ]);

      Alert.alert('Success', 'Data deleted successfully');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to delete data');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Image source={{ uri: editedImage }} style={styles.image} />
      <Text style={styles.title}>{judul}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Genre</Text>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.value}>{genre}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Tahun</Text>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.value}>{tahun}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Episode</Text>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.value}>{jumlah_episode}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Durasi</Text>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.value}>{durasi} menit</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Studio</Text>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.value}>{studio}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.value}>{status}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Sinopsis</Text>
        <Text style={styles.separator}>:</Text>
      </View>
      <Text style={styles.valueSinopsis}>{sinopsis}</Text>

      {isEditing ? (
        <>
          <TextInput style={styles.input} value={editedJudul} onChangeText={setEditedJudul} placeholder="Judul" />
          <TextInput style={styles.input} value={editedTahun} onChangeText={setEditedTahun} placeholder="Tahun" keyboardType="numeric" />
          <TextInput style={styles.input} value={editedGenre} onChangeText={setEditedGenre} placeholder="Genre" />
          <TextInput style={styles.input} value={editedImage} onChangeText={setEditedImage} placeholder="Image URL" />
          <TextInput style={styles.input} value={editedJumlahEpisode} onChangeText={setEditedJumlahEpisode} placeholder="Jumlah Episode" keyboardType="numeric" />
          <TextInput style={styles.input} value={editedDurasi} onChangeText={setEditedDurasi} placeholder="Durasi" keyboardType="numeric" />
          <TextInput style={styles.input} value={editedStudio} onChangeText={setEditedStudio} placeholder="Studio" />
          <TextInput style={styles.input} value={editedStatus} onChangeText={setEditedStatus} placeholder="Status" />
          <TextInput style={styles.input} value={editedSinopsis} onChangeText={setEditedSinopsis} placeholder="Sinopsis" multiline />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#545b62' 
  },
  image: { 
    width: '100%', 
    height: 300, 
    resizeMode: 'contain', 
    borderRadius: 10, 
    marginBottom: 10 
  },
  title: { 
    fontSize: 25, 
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign:'center'
  },
  infoRow: { 
    flexDirection: 'row',
    marginBottom: 5 
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: 'white', 
    width: 70,
  },
  separator: {
    fontSize: 16,
    color: 'white',
    marginRight: 5
  },
  value: { 
    fontSize: 16, 
    color: 'white',
    flex: 1
  },
  valueSinopsis: { 
    fontSize: 16, 
    color: 'white',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#fff'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    marginBottom: 50,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    marginBottom: 50,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 50
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailScreen;
