import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import axios from "axios";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { initDatabase, getAnimeFromDatabase, insertAnime, CombinedData } from '../database/database';

type HomeScreenProps = DrawerScreenProps<any, "Home">;

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [data, setData] = useState<CombinedData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const detectOrientation = () => {
    const { width, height } = Dimensions.get("window");
    setIsLandscape(width > height);
  };

  useEffect(() => {
    initDatabase();
    fetch();
    detectOrientation();

    const subscription = Dimensions.addEventListener("change", detectOrientation);
    return () => subscription?.remove();
  }, []);

  const fetch = async () => {
    try {
      const localData = await getAnimeFromDatabase();
      
      if (localData.length > 0) {
        setData(localData);
      } else {
        const [infoDasarResponse, detailResponse] = await Promise.all([
          axios.get<Omit<CombinedData, 'jumlah_episode' | 'durasi' | 'studio' | 'link'>[]>(
            "https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar"
          ),
          axios.get<Pick<CombinedData, 'id' | 'jumlah_episode' | 'durasi' | 'studio' | 'link'>[]>(
            "https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail"
          ),
        ]);

        const infoDasarData = infoDasarResponse.data;
        const detailData = detailResponse.data;

        const combinedData: CombinedData[] = infoDasarData.map((info) => {
          const detail = detailData.find((d) => d.id === info.id);
          return {
            ...info,
            jumlah_episode: detail?.jumlah_episode ?? "Unknown",
            durasi: detail?.durasi ?? 0,
            studio: detail?.studio ?? "Unknown",
            link: detail?.link ?? "Unknown",
          };
        });

        for (const anime of combinedData) {
          await insertAnime(anime);
        }

        const sortedData = combinedData.sort((a, b) => a.id.localeCompare(b.id));
        setData(sortedData);
      }
    } catch (e) {
      console.log("Error fetching data:", e);
    }
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetch().then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={[
          styles.productList,
          isLandscape && styles.landscapeProductList,
        ]}
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.productCard,
              isLandscape && styles.landscapeProductCard,
            ]}
            onPress={() => navigation.navigate("Detail", { ...item })}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.judul}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: "#545b62",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  landscapeProductList: {
    justifyContent: "space-around",
  },
  productCard: {
    width : "30%",
    backgroundColor: "#b291f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  landscapeProductCard: {
    marginHorizontal: 2,
    width: "15%"
  },
  productImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    borderRadius: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: "#fff",
    textAlign: "center",
  },
});

export default Home;

