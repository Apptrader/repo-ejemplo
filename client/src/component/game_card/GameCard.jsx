import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./gameCard.module.css";
import { useNavigate } from "react-router-dom";



function GameCard({ game }) {
  const navigate = useNavigate();
  const [apiGenres, setApiGenres] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
        if (isNaN(game.id)) {
            try {
                const response = await axios.get(`http://localhost:3001/api/genres/${game.id}`);
                setApiGenres(response.data);
            } catch (error) {
                console.error("Error fetching API genres:", error);
            }
        }
    };

    fetchData();
}, [game.id]);

  const handleClick = () => {
    navigate(`/detail/${game.id}`);
  };

  return (
    <div className={styles.cardWrapper} onClick={handleClick}>
      <p>{game.name}</p>
      {game.createdAt ? (
        <>
          <img className={styles.image} src={game.image} alt={game.name} />
          <div className={styles.genreDiv}>
            {apiGenres.map((genre, index) => (
              <p className={styles.genreBorder} key={index}>
                {genre.name}
              </p>
            ))}
          </div>
        </>
      ) : (
        <>
          <img className={styles.image} src={game.background_image} alt={game.name} />
          <div className={styles.genreDiv}>
            {game.genres.map((genre, index) => (
              <p className={styles.genreBorder} key={index}>
                {genre.name}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default GameCard;