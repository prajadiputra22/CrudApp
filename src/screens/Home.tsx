import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { DrawerScreenProps } from "@react-navigation/drawer";

interface InfoDasar {
  id: string;
  judul: string;
  tahun: number;
  genre: string;
  sinopsis: string;
  image: string;
}

interface Detail {
  id: string;
  jumlah_episode: number | string;
  durasi: number;
  studio: string;
  link?: string;
}

interface CombinedData extends InfoDasar, Detail {}

type HomeScreenProps = DrawerScreenProps<any, "Home">;

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [data, setData] = useState<CombinedData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Function to detect orientation
  const detectOrientation = () => {
    const { width, height } = Dimensions.get("window");
    setIsLandscape(width > height);
  };

  useEffect(() => {
    fetch();
    detectOrientation();

    const subscription = Dimensions.addEventListener("change", detectOrientation);
    return () => subscription?.remove();
  }, []);

  const fetch = async () => {
    try {
      const [infoDasarResponse, detailResponse] = await Promise.all([
        axios.get(
          "https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/InfoDasar"
        ),
        axios.get(
          "https://671f7dd1e7a5792f052e711f.mockapi.io/infonime/Detail"
        ),
      ]);

      const infoDasarData: InfoDasar[] = infoDasarResponse.data;
      const detailData: Detail[] = detailResponse.data;

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

      const sortedData = combinedData.sort((a, b) => a.id.localeCompare(b.id));
      setData(sortedData);
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
