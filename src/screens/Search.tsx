import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';

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
  tautan: string;
};

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchAnime = async () => {
    setIsLoading(true);
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
          tautan: detail?.tautan ?? 'Unknown',
        };
      });

      const sortedData = combinedData.sort((a: Anime, b: Anime) => a.judul.localeCompare(b.judul));
      setAnimeList(sortedData);
      setFilteredAnime(sortedData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Monitor koneksi internet
    const unsubscribe = NetInfo.addEventListener(state => {
      const newIsOnline = state.isConnected ?? false;
      if (!isOnline && newIsOnline) {
        // Jika sebelumnya offline dan sekarang online, refresh data
        fetchAnime();
      }
      setIsOnline(newIsOnline);
    });

    // Initial fetch
    fetchAnime();

    return () => {
      unsubscribe();
    };
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

  const onRefresh = useCallback(() => {
    fetchAnime();
  }, []);

  const NetworkStatus = () => (
    !isOnline ? (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No Internet Connection</Text>
      </View>
    ) : null
  );

  const renderItem = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      style={[styles.card, { maxWidth: isLandscape ? '48%' : '100%' }]}
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
      <NetworkStatus />
      <TextInput
        style={styles.searchInput}
        placeholder="Search anime..."
        value={searchText}
        onChangeText={handleSearch}
        placeholderTextColor="#ccc"
      />
      <FlatList
        data={filteredAnime}
        key={isLandscape ? 'h' : 'v'}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        numColumns={isLandscape ? 2 : 1}
        columnWrapperStyle={isLandscape ? styles.row : undefined}
        extraData={isLandscape}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={['#b291f5']}
            tintColor="#b291f5"
          />
        }
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
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 5,
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
  row: {
    justifyContent: 'space-between',
  },
  offlineContainer: {
    backgroundColor: '#f44336',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchScreen;