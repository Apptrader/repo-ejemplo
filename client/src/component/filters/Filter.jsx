import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styles from './filter.module.css';
import axios from 'axios';

function Filter({ videogames, setAllVideogames, setCurrentPage }) {
  const games = videogames.data[0];
  const genres = useSelector((state) => state?.genres);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [azFilter, setAzFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [filterGames, setFilterGames] = useState(games);
  const [searchTerm, setSearchTerm] = useState('');
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

    
    const combinedFilter = applyCombinedFilters(games, genreGames);
    setAzFilter("")
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

    
    const combinedFilter = applyCombinedFilters(games, originGames);
    setAzFilter("")
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

  
  const applyCombinedFilters = (...filters) => {
    return filters.reduce((result, currentFilter) => {
      return result.filter((game) => currentFilter.includes(game));
    });
  };


  const handleAzFilter = (event) => {
    const selectedAzOption = event.target.value;
    setAzFilter(selectedAzOption);

    let sortedGames = [...filterGames];

    if (selectedAzOption === 'az') {
      sortedGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedAzOption === 'za') {
      sortedGames.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilterGames(sortedGames);
    setShouldUpdateAllVideogames(true);
  };

  const handleRatingFilter = (event) => {
    const selectedRating = event.target.value;
    setRatingFilter(selectedRating);  
  
    let sortedGames = [...filterGames];
  
    if (selectedRating === 'ascending') {
      sortedGames.sort((a, b) => a.rating - b.rating);  
    } else if (selectedRating === 'descending') {
      sortedGames.sort((a, b) => b.rating - a.rating);  
    }
  
    setFilterGames(sortedGames);
    setShouldUpdateAllVideogames(true);

    
  };

  

  const handleSearch = (event) => {
    console.log("papa")
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    const searchFilter = games.filter((game) =>
      game.name.toLowerCase().includes(newSearchTerm.toLowerCase())
    );

    const combinedFilter = applyCombinedFilters(games, searchFilter);
    setFilterGames(combinedFilter);
    setShouldUpdateAllVideogames(true);
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
      <div className={styles.filter}>
        <label>Filter by A-Z</label>
        <select value={azFilter} onChange={handleAzFilter}>
          <option></option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>
      <div className={styles.filter}>
        <label>Filter by Rating</label>
        <select value={ratingFilter} onChange={handleRatingFilter}>
          <option></option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>
      <div className={styles.filter}>
        <label>Search by Name</label>
        <input type="text" value={searchTerm} onChange={handleSearch} />
      </div>
    </div>
  );
}

export default Filter;