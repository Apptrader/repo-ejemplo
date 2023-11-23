import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './detail.module.css'


function Detail() {
    const [game, setGame] = useState({});
    const [apiGenres, setApiGenres] = useState([])
    const { id } = useParams()


    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (!isNaN(id)) {
                    response = await axios.get(`http://localhost:3001/api/videogames/${id}`);
                    setGame(response.data);
                } else {
                    response = await axios.get(`http://localhost:3001/api/videogames/api/${id}`);
                    const genres = await axios.get(`http://localhost:3001/api/genres/${id}`);
                    setApiGenres(genres.data);
                    setGame(response.data);
                    console.log(response.data)
                }
            } catch (error) {
                console.error('Error fetching game:', error);
            }
        };
        console.log(game)
        console.log(apiGenres)
        fetchData();
    }, [id]);


    if (!isNaN(id) && game) {
        return (
            <div className={styles.container}>
                <div className={styles.detailWrapper}>
                    <img src={game.background_image} className={styles.img} />
                    <h2>{game.name}</h2>
                    {game.description && <p className={styles.description}>{game.description.replace(/<\/?p>/g, '')}</p>}

                </div>
                <div>
                    <div className={styles.ratingWrapper}>
                        <h2 className={styles.infoTitle}>Game information</h2>
                        <div className={styles.infoDiv}>
                            <p>Realease Date: {game.released}</p>
                            <p>Rating: {game.rating}</p>
                            <p>Id: {game.id}</p>
                        </div>
                    </div>
                    <div className={styles.genresWrapper}>
                        <div className={styles.genreDiv}>
                            <div>
                                <div className={styles.subDiv}>
                                    <h2 className={styles.infoTitle}>Platforms</h2>
                                    {game.platforms && game.platforms.map((plat, index) => {
                                        return (
                                            <p key={index}>{plat.platform.name}</p>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={styles.subDiv}>
                                <h2 className={styles.infoTitle}>Genres</h2>
                                {game.genres && game.genres.map((genre, index) => {
                                    return (
                                        <p key={index}>{genre.name}</p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );

    } else {
        if (game) {
            console.log(game)
            return (

                <div className={styles.container}>
                    <div className={styles.detailWrapper}>
                        <img src={game.image} className={styles.img} />
                        <h2>{game.name}</h2>
                        <p className={styles.description}>{game.description}</p>

                    </div>
                    <div>
                        <div className={styles.ratingWrapper}>
                            <h2 className={styles.infoTitle}>Game information</h2>
                            <div className={styles.infoDiv}>
                                <p><span className={styles.infoText}>Realease Date: </span> {game.releaseDate}</p>
                                <p><span className={styles.infoText}>Rating: </span>{game.rating}</p>
                                <p><span className={styles.infoText}>Id: </span> {game.id}</p>
                            </div>
                        </div>
                        <div className={styles.genresWrapper}>
                            <div className={styles.genreDiv}>
                                <div>
                                    <div className={styles.subDiv}>
                                        <h2 className={styles.infoTitle}>Platforms</h2>
                                        {game.platforms && JSON.parse(game.platforms).map((plat, index) => {
                                            return (
                                                <p key={index}>{plat}</p>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className={styles.subDiv}>
                                    <h2 className={styles.infoTitle}>Genres</h2>
                                    {apiGenres && apiGenres.map((genre, index) => {
                                        return (
                                            <p key={index}>{genre.name}</p>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    }
}

export default Detail;

