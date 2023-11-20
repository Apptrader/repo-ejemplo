import { useSelector } from 'react-redux';
import { useState } from 'react';
import styles from './filter.module.css';
import axios from 'axios';

function Filter({videogames, setAllVideogames, setCurrentPage}) {
  const genres = useSelector((state) => state?.genres);
  const [selectedGenre, setSelectedGenre] = useState('');
  const games = videogames.data[0]

  const handleSelectGenre = async (event) => {
    const newSelectedGenre = event.target.value;
    setSelectedGenre(newSelectedGenre);

    const filterGames = [];

    for (const game of games.db) {
      try {
        const response = await axios.get(`http://localhost:3001/api/genres/${game.id}`);
        
        if (response.data.some((genre) => genre.name === newSelectedGenre)) {
          filterGames.push(game);
        }
      } catch (error) {
        console.error(`Error fetching data for game with ID ${game.id}`, error);
      }
    }

    
    for (let i = 0; i < games.api.length; i++) {
        const genres = games.api[i].genres.map((g) => g.name)
        for ( let g = 0; g < genres.length; g++) {
            if(genres[g] === newSelectedGenre){
                filterGames.push(games.api[i])
            }
        }
        
    }


    setCurrentPage(1)
    setAllVideogames(filterGames); 
    
  };
  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <label>Origin:</label>
        <select value={selectedGenre} onChange={handleSelectGenre}>
          <option value="">Select a genre</option>
          {genres &&
            genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default Filter;
