/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styles from './filter.module.css';
import axios from 'axios';

function Filter({ videogames, setAllVideogames, setCurrentPage }) {
  const games = videogames.data[0];
  const genres = useSelector((state) => state?.genres);

  //estado local para todos los filtros
  const [allFilters, setAllFilters] = useState({
    genre: '',
    origin: '',
    az: '',
    rating: '',
    searchTerm: '',
  });

  const [filterGames, setFilterGames] = useState(games);
  const [shouldUpdateAllVideogames, setShouldUpdateAllVideogames] = useState(false);

  const handleClearAll = () => {
    setAllFilters({
      genre: '',
      origin: '',
      az: '',
      rating: '',
      searchTerm: '',
    });
  }

  const applySortFilter = (games, sortingOptions) => {
    let sortedGames = [...games];

    sortingOptions.forEach((sortingOption) => {
      if (sortingOption === 'az') {
        sortedGames.sort((a, b) => a.name.localeCompare(b.name));
      } 
      
      else if (sortingOption === 'za') {
        sortedGames.sort((a, b) => b.name.localeCompare(a.name));
      } 
      
      else if (sortingOption === 'ascending') {
        sortedGames.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      } 
      
      else if (sortingOption === 'descending') {
        sortedGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    });

    return sortedGames;
  };

  useEffect(() => {
    const applyAllFilters = async () => {
      let filteredGames = [...games];
  
      // Filtrar por género
      if (allFilters.genre !== '') {
        try {
          const genreGames = await Promise.all(
            filteredGames.map(async (game) => {
              if (isNaN(game.id)) {
                try {
                  const response = await axios.get(`http://localhost:3001/api/genres/${game.id}`);
                  if (response.data.some((genre) => genre.name === allFilters.genre)) {
                    return game;
                  }
                } catch (error) {
                  console.error(`Error fetching data for game with ID ${game.id}`, error);
                }
              } else {
                if (game.genres.some((g) => g.name === allFilters.genre)) {
                  return game;
                }
              }
              return null;
            })
          );
  
          filteredGames = genreGames.filter((game) => game !== null);
        } catch (error) {
          console.error('Error applying genre filter', error);
        }
      }
  
      // filtro por origen
      if (allFilters.origin !== '') {
        filteredGames = filteredGames.filter((game) => {
          return (
            (allFilters.origin === 'db' && isNaN(game.id)) ||
            (allFilters.origin === 'api' && !isNaN(game.id))
          );
        });
      }
  
      if (allFilters.az !== '' || allFilters.rating !== '') {
        filteredGames = applySortFilter(filteredGames, [allFilters.az, allFilters.rating]);
      }
  
      if (allFilters.searchTerm !== '') {
        filteredGames = filteredGames.filter((game) => {
          return game.name.toLowerCase().includes(allFilters.searchTerm.toLowerCase());
        });
      }
  
      setFilterGames(filteredGames);
      setShouldUpdateAllVideogames(true);
    };
  
    applyAllFilters(); // Aplicar los filtros al cargar la página
  }, [allFilters, games]);

  useEffect(() => {
    if (shouldUpdateAllVideogames) {
      setCurrentPage(1);
      setAllVideogames(filterGames);
    }

    setShouldUpdateAllVideogames(false);
  }, [filterGames, shouldUpdateAllVideogames]);

  const handleSelectGenre = (event) => {
    const newSelectedGenre = event.target.value;
    setAllFilters((prevFilters) => ({ ...prevFilters, genre: newSelectedGenre }));
  };

  const handleOriginFilter = (event) => {
    const newSelectedOrigin = event.target.value;
    setAllFilters((prevFilters) => ({ ...prevFilters, origin: newSelectedOrigin }));
  };

  const handleAzFilter = (event) => {
    const selectedAzOption = event.target.value;
    setAllFilters((prevFilters) => ({ ...prevFilters, az: selectedAzOption }));
  };

  const handleRatingFilter = (event) => {
    const selectedRating = event.target.value;
    setAllFilters((prevFilters) => ({ ...prevFilters, rating: selectedRating }));
  };

  const handleSearch = (event) => {
    const newSearchTerm = event.target.value;
    setAllFilters((prevFilters) => ({ ...prevFilters, searchTerm: newSearchTerm }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <label>Filter by genre</label>
        <select value={allFilters.genre} onChange={handleSelectGenre}>
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
        <select value={allFilters.origin} onChange={handleOriginFilter}>
          <option value="">Select Origin</option>
          <option value="api">Api</option>
          <option value="db">Data Base</option>
        </select>
      </div>
      <div className={styles.filter}>
        <label>Filter by A-Z</label>
        <select value={allFilters.az} onChange={handleAzFilter}>
          <option value="">Select Order</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>
      <div className={styles.filter}>
        <label>Filter by Rating</label>
        <select value={allFilters.rating} onChange={handleRatingFilter}>
          <option value="">Select Order</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>
      <div className={styles.filter}>
        <label>Search by Name</label>
        <input type="text" value={allFilters.searchTerm} onChange={handleSearch} />
      </div>
      <div className={styles.clearAll}>
        <button onClick={handleClearAll}>Clear All</button>
      </div>
    </div>
  );
}

export default Filter;
