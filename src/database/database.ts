import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export interface CombinedData {
  id: string;
  judul: string;
  tahun: number;
  genre: string;
  sinopsis: string;
  image: string;
  jumlah_episode: number | string;
  durasi: number;
  studio: string;
  link?: string;
}

const getDatabase = async () => {
  return SQLite.openDatabase({ name: 'AnimeDatabase.db', location: 'default' });
};

export const initDatabase = async () => {
  const db = await getDatabase();
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS anime (
      id TEXT PRIMARY KEY NOT NULL,
      judul TEXT,
      tahun INTEGER,
      genre TEXT,
      sinopsis TEXT,
      image TEXT,
      jumlah_episode TEXT,
      durasi INTEGER,
      studio TEXT,
      link TEXT
    );
  `);
};

export const getAnimeFromDatabase = async (): Promise<CombinedData[]> => {
  const db = await getDatabase();
  const [results] = await db.executeSql('SELECT * FROM anime');
  const animeList: CombinedData[] = [];
  
  for (let i = 0; i < results.rows.length; i++) {
    animeList.push(results.rows.item(i));
  }
  
  return animeList;
};

export const insertAnime = async (anime: CombinedData): Promise<void> => {
  const db = await getDatabase();
  await db.executeSql(
    `INSERT OR REPLACE INTO anime (id, judul, tahun, genre, sinopsis, image, jumlah_episode, durasi, studio, link)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [anime.id, anime.judul, anime.tahun, anime.genre, anime.sinopsis, anime.image, 
     anime.jumlah_episode, anime.durasi, anime.studio, anime.link]
  );
};
