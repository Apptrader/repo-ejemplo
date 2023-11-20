import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styles from './filter.module.css';
import axios from 'axios';

function Filter({ videogames, setAllVideogames, setCurrentPage }) {
  const games = videogames.data[0];
  const genres = useSelector((state) => state?.genres);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [filterGames, setFilterGames] = useState(games);
  const [shouldUpdateAllVideogames, setShouldUpdateAllVideogames] = useState(false);

  const handleSelectGenre = async (event) => {
    const newSelectedGenre = event.target.value;
    setSelectedGenre(newSelectedGenre);

    let genreGames = [];

    for (const game of games) {
      if (isNaN(game.id)) {
        try {
          const response = await axios.get(`http://localhost:3001/api/genres/${game.id}`);
          if (response.data.some((genre) => genre.name === newSelectedGenre)) {
            genreGames.push(game);
          }
        } catch (error) {
          console.error(`Error fetching data for game with ID ${game.id}`, error);
        }
      } else {
        const genres = game.genres.map((g) => g.name);
        if (genres.includes(newSelectedGenre)) {
          genreGames.push(game);
        }
      }
    }

    // Combina el filtro de género con el filtro actual
    const combinedFilter = applyCombinedFilters(games, genreGames);

    setFilterGames(combinedFilter);
    setShouldUpdateAllVideogames(true);
  };

  const handleOriginFilter = (event) => {
    const newSelectedOrigin = event.target.value;
    setSelectedOrigin(newSelectedOrigin);

    let originGames = [];

    for (const game of games) {
      if (newSelectedOrigin === "db" && isNaN(game.id)) {
        originGames.push(game);
      } else if (newSelectedOrigin === "api" && !isNaN(game.id)) {
        originGames.push(game);
      }
    }

    // Combina el filtro de origen con el filtro actual
    const combinedFilter = applyCombinedFilters(games, originGames);

    setFilterGames(combinedFilter);
    setShouldUpdateAllVideogames(true);
  };

  useEffect(() => {
    if (shouldUpdateAllVideogames) {
      setCurrentPage(1);
      setAllVideogames(filterGames);
    }

    setShouldUpdateAllVideogames(false);
  }, [filterGames, shouldUpdateAllVideogames]);

  // Función para combinar múltiples filtros
  const applyCombinedFilters = (...filters) => {
    return filters.reduce((result, currentFilter) => {
      return result.filter((game) => currentFilter.includes(game));
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <label>Filter by genre</label>
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
      <div className={styles.filter}>
        <label>Filter by Origin</label>
        <select value={selectedOrigin} onChange={handleOriginFilter}>
          <option>Select Origin</option>
          <option value="api">Api</option>
          <option value="db">Data Base</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;