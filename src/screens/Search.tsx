import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Anime = {
  id: string;
  judul: string;
  tahun: number;
  genre: string;
  image: string;
  status: string;
  sinopsis: string;
  jumlah_episode: number | string;
  durasi: number;
  studio: string;
};

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const [infoDasarResponse, detailResponse] = await Promise.all([
          axios.get('https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar'),
          axios.get('https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail'),
        ]);

        const infoDasarData = infoDasarResponse.data;
        const detailData = detailResponse.data;

        const combinedData = infoDasarData.map((info: Anime) => {
          const detail = detailData.find((d: any) => d.id === info.id);
          return {
            ...info,
            jumlah_episode: detail?.jumlah_episode ?? 'Unknown',
            durasi: detail?.durasi ?? 0,
            studio: detail?.studio ?? 'Unknown',
          };
        });

        const sortedData = combinedData.sort((a: Anime, b: Anime) => a.judul.localeCompare(b.judul));
        setAnimeList(sortedData);
        setAnimeList(combinedData);
        setFilteredAnime(combinedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAnime();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = animeList.filter((anime) =>
      anime.judul.toLowerCase().startsWith(text.toLowerCase())
    );
    setFilteredAnime(filtered);
  };

  const handleItemPress = (item: Anime) => {
    navigation.navigate('Detail', item);
  };

  const renderItem = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleItemPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.judul}</Text>
        <Text style={styles.subtitle}>{item.genre}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search anime..."
        value={searchText}
        onChangeText={handleSearch}
        placeholderTextColor="#ccc"
      />
      <FlatList
        data={filteredAnime}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#545b62',
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default SearchScreen;
