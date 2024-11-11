import React from 'react';
import AppNavigator from './src/navigation/AppNavigation';


const App = () => {
  return (
    <>
      <AppNavigator />
    </>
  );
};

export default App;
// const sortedData = combinedData.sort((a: Anime, b: Anime) => a.judul.localeCompare(b.judul));
// setAnimeList(sortedData);