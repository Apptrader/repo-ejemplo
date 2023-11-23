import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import GameCard from "../game_card/GameCard";
import styles from './videoGamesCards.module.css';
import Filter from "../filters/Filter";

function VideoGameCards() {
  const videogames = useSelector((state) => state.videogames[0]);

  const gamesPage = 15;
  const [allVideoGames, setAllVideogames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedVideoGames, setPaginatedVideoGames] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const paginate = (array, pageSize) => {
    const result = [];

    for (let index = 0; index < array.length; index++) {
      const pageIndex = Math.floor(index / pageSize);

      if (!result[pageIndex]) {
        result[pageIndex] = [];
      }

      result[pageIndex].push(array[index]);
    }

    return result;
  };

  const updatePaginatedGames = (games) => {
    const paginatedGames = paginate(games, gamesPage);
    setPaginatedVideoGames(paginatedGames);
    setTotalPages(paginatedGames.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (videogames) {
        const games = videogames.data[0];
        setAllVideogames(games);
        updatePaginatedGames(games);
      }
    };

    fetchData();
  }, [videogames, gamesPage]);

  useEffect(() => {
    updatePaginatedGames(allVideoGames);
  }, [allVideoGames, gamesPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!videogames) {
    return (
        <>
          <img className={styles.loading} src="https://htmlburger.com/blog/wp-content/uploads/2021/07/The-Best-50-Website-Preloaders-Around-the-Web-Example-13a.gif" alt="loading" />;
          <p className={styles.loadingText}>LOADING...</p>
        </>
    )
  }

  if (!allVideoGames || allVideoGames.length === 0) {
    return (
      <>
        <Filter videogames={videogames} setAllVideogames={setAllVideogames} setCurrentPage={setCurrentPage} />
        <p>No se han encontrado videojuegos</p>;
      </>
    ) 
  }

  return (
    <>
      <Filter videogames={videogames} setAllVideogames={setAllVideogames} setCurrentPage={setCurrentPage} />
      <div className={styles.container}>
        {paginatedVideoGames && paginatedVideoGames[currentPage - 1] && paginatedVideoGames[currentPage - 1].map((game, index) => (
          <GameCard game={game} key={index} />
        ))}
      </div>
      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.anterior}>
          Prev.
        </button>
        <span className={styles.numbers}>
          {paginatedVideoGames && paginatedVideoGames.map((number, index) => (
            <p onClick={() => handlePageChange(index + 1)} className={`${styles.number} ${index + 1 === currentPage ? styles.currentPage : ''}`} key={index}>{index + 1}</p>
          ))}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.siguiente}>
          Next
        </button>
      </div>
    </>
  );
}

export default VideoGameCards;