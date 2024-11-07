import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DrawerScreenProps } from '@react-navigation/drawer';

// Tipe untuk InfoDasar yang diambil dari API
interface InfoDasar {
  id: string;
  judul: string;
  tahun: number;
  genre: string;
  sinopsis: string;
  image: string;
}

// Tipe untuk Detail yang diambil dari API
interface Detail {
  id: string;
  jumlah_episode: number;
  durasi: number;
  studio: string;
}

// Tipe untuk item yang digabungkan
interface CombinedData extends InfoDasar, Detail {}

type HomeScreenProps = DrawerScreenProps<any, 'Home'>;

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [data, setData] = useState<CombinedData[]>([]);

  // Fungsi untuk mengambil data dari API
  const fetch = async () => {
    try {
      const [infoDasarResponse, detailResponse] = await Promise.all([
        axios.get('https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar'),
        axios.get('https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail'),
      ]);

      const infoDasarData: InfoDasar[] = infoDasarResponse.data;
      const detailData: Detail[] = detailResponse.data;

      // Menggabungkan data berdasarkan ID
      const combinedData: CombinedData[] = infoDasarData.map(info => {
        const detail = detailData.find(d => d.id === info.id);
        return { 
          ...info, 
          jumlah_episode: detail?.jumlah_episode ?? 0,
          durasi: detail?.durasi ?? 0,
          studio: detail?.studio ?? 'Unknown',
        };
      });

      setData(combinedData);
    } catch (e) {
      console.log('Error fetching data:', e);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productList}>
        {data.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.productCard}
            onPress={() => navigation.navigate('Detail', { ...item })}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.judul}</Text>
            <Text style={styles.productGenre}>Genre: {item.genre}</Text>
            <Text style={styles.productYear}>Tahun: {item.tahun}</Text>
            <Text style={styles.productDetails}>Episode: {item.jumlah_episode}</Text>
            <Text style={styles.productDetails}>Durasi: {item.durasi} menit</Text>
            <Text style={styles.productDetails}>Studio: {item.studio}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#545b62',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#b291f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#fff' 
  },
  productGenre: {
    fontSize: 14,
    color: '#fff', 
  },
  productYear: {
    fontSize: 14,
    color: '#fff', 
  },
  productSynopsis: {
    fontSize: 14,
    color: '#fff', 
    marginTop: 5,
  },
  productDetails: {
    fontSize: 14,
    color: '#fff', 
    marginTop: 2,
  },
});

export default Home;
