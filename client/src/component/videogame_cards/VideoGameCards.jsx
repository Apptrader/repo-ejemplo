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

  useEffect(() => {
    const fetchData = async () => {
      if (videogames) {
        const combinedVideoGames = videogames.data[0].db.concat(videogames.data[0].api);
        setAllVideogames(combinedVideoGames);

        const paginatedGames = paginate(combinedVideoGames, gamesPage);
        setPaginatedVideoGames(paginatedGames);
        setTotalPages(paginatedGames.length);
      }
    };

    fetchData();
  }, [videogames, gamesPage]);

  useEffect(() => {
    
    const paginatedGames = paginate(allVideoGames, gamesPage);
    setPaginatedVideoGames(paginatedGames);
    setTotalPages(paginatedGames.length);
  }, [allVideoGames, gamesPage]);

  function paginate(array, pageSize) {
    const result = [];

    for (let index = 0; index < array.length; index++) {
      const pageIndex = Math.floor(index / pageSize);

      if (!result[pageIndex]) {
        result[pageIndex] = [];
      }

      result[pageIndex].push(array[index]);
    }

    return result;
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!allVideoGames || allVideoGames.length === 0) {
    return <p>Cargando videojuegos...</p>;
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
          Anterior
        </button>
        <span className={styles.numbers}>
          {paginatedVideoGames && paginatedVideoGames.map((number, index) => (
            <p onClick={() => handlePageChange(index + 1)} className={`${styles.number} ${index + 1 === currentPage ? styles.currentPage : ''}`} key={index}>{index + 1}</p>
          ))}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.siguiente}>
          Siguiente
        </button>
      </div>
    </>
  );
}

export default VideoGameCards;