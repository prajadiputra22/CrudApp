import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddAnime = () => {
  const [judul, setJudul] = useState('');
  const [tahun, setTahun] = useState('');
  const [genre, setGenre] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
  const [jumlahEpisode, setJumlahEpisode] = useState('');
  const [durasi, setDurasi] = useState('');
  const [studio, setStudio] = useState('');
  const [tautan, setTautan] = useState('');

  const saveLinkToStorage = async (id: string, link: string) => {
    try {
      const savedLinksJson = await AsyncStorage.getItem('savedLinks');
      const savedLinks = savedLinksJson ? JSON.parse(savedLinksJson) : {};
      savedLinks[id] = link;
      await AsyncStorage.setItem('savedLinks', JSON.stringify(savedLinks));
    } catch (error) {
      console.error('Error saving link:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!judul || !tahun || !genre || !status || !image || !jumlahEpisode || !durasi || !studio) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      const infoDasarResponse = await axios.post('https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar', {
        judul,
        tahun: parseInt(tahun, 10),
        genre,
        sinopsis,
        status,
        image,
      });
  
      const infoDasarId = infoDasarResponse.data.id;

      await axios.post('https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail', {
        id: infoDasarId,
        jumlah_episode: parseInt(jumlahEpisode, 10),
        durasi: parseInt(durasi, 10),
        studio,
        tautan: tautan.trim(),
      });

      if (tautan) {
        await saveLinkToStorage(infoDasarId, tautan);
      }
  
      Alert.alert("Success", "Anime data added successfully!");
  
      setJudul('');
      setTahun('');
      setGenre('');
      setSinopsis('');
      setStatus('');
      setImage('');
      setJumlahEpisode('');
      setDurasi('');
      setStudio('');
      setTautan('');

    } catch (error) {
      Alert.alert("Error", "Failed to add anime data.");
      console.error("Error posting data:", error);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Input Data Anime</Text>

        <TextInput
          placeholder="Judul"
          value={judul}
          onChangeText={setJudul}
          style={styles.input}
        />
        <TextInput
          placeholder="Tahun"
          value={tahun}
          onChangeText={setTahun}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Genre"
          value={genre}
          onChangeText={setGenre}
          style={styles.input}
        />
        <TextInput
          placeholder="Status"
          value={status}
          onChangeText={setStatus}
          style={styles.input}
        />
        <TextInput
          placeholder="Image URL"
          value={image}
          onChangeText={setImage}
          style={styles.input}
        />
        <TextInput
          placeholder="Jumlah Episode"
          value={jumlahEpisode}
          onChangeText={setJumlahEpisode}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Durasi (menit)"
          value={durasi}
          onChangeText={setDurasi}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Studio"
          value={studio}
          onChangeText={setStudio}
          style={styles.input}
        />
        <TextInput
          placeholder="tautan"
          value={tautan}
          onChangeText={setTautan}
          style={styles.input}
        />
        <TextInput
          placeholder="Sinopsis"
          value={sinopsis}
          onChangeText={setSinopsis}
          style={[styles.input, styles.multiLineInput]}
          multiline
          numberOfLines={4}
        />
        <Button title="Submit Anime Data" onPress={handleSubmit} />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#545b62',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  multiLineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddAnime;
