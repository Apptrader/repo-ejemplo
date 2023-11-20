import { useEffect, useState } from 'react';
import styles from './create.module.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getGenres, getPlatforms } from '../../redux/actions';
import validateInput from '../../functions/validations';

function Create() {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state?.genres);
  const platforms = useSelector((state) => state?.platforms);

  const [gameInfo, setGameInfo] = useState({
    id: '',
    name: '',
    image: '',
    platforms: '',
    description: '',
    releasedDate: '',
    rating: '',
    genres: '',
    apiGame: true
  });
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if(genres.length === 0)
    {
      dispatch(getGenres());
    }
    if(platforms.length === 0){
      dispatch(getPlatforms());
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInput(gameInfo);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(`http://localhost:3001/api/videogames/add`, gameInfo);
        console.log(response);

        if (response.data.error === 0) {
          window.alert("Game Created");
          setGameInfo({
          });
          setSelectedGenres([]);
          setSelectedPlatforms([]);
        } else {
          console.error("Error creating game:", response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          window.alert(`Bad Request: ${error.response.data.error}`);
        } else {
          console.log(error);
          console.error("Request error:", error.message);
          console.log(error.message);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGameInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));

    const validationErrors = validateInput({ ...gameInfo, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationErrors[name],
    }));
  };

  console.log(gameInfo)
  console.log(errors)

  const handleSelectedGenre = (genre) => {
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(genre)) {
        return prevGenres.filter((g) => g !== genre);
      } else {
        return [...prevGenres, genre];
      }
    });

    setGameInfo((prevInfo) => ({
      ...prevInfo,
      genres: selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre],
    }));


    const validationErrors = validateInput({ ...gameInfo, genres: selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre] });
    setErrors((prevErrors) => ({
      ...prevErrors,
      genres: validationErrors.genres,
    }));
  };

  const handleSelectedPlatform = (platform) => {
    setSelectedPlatforms((prevPlatforms) => {
      if (prevPlatforms.includes(platform)) {
        return prevPlatforms.filter((p) => p !== platform);
      } else {
        return [...prevPlatforms, platform];
      }
    });

    setGameInfo((prevInfo) => ({
      ...prevInfo,
      platforms: selectedPlatforms.includes(platform) ? selectedGenres.filter((p) => p !== platform) : [...selectedPlatforms, platform],
    }))

    const validationErrors = validateInput({ ...gameInfo, platforms: selectedPlatforms.includes(platform) ? selectedPlatforms.filter((p) => p !== platform) : [...selectedPlatforms, platform] });
    setErrors((prevErrors) => ({
      ...prevErrors,
      platforms: validationErrors.platforms,
    }));
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Create VideoGame</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.wrapper}>
          <div>
            <div className={styles.imgWrapper}>
              <img className={styles.gameImage} src={gameInfo.image} alt="Game Cover" />
              <label>Image</label>
              <input
                type="text"
                name="image"
                value={gameInfo.image}
                onChange={handleChange}
                className={errors.image && styles.error}
              />
              {errors.image && <div className={styles.errorMessage}>{errors.image}</div>}
              {gameInfo.image && (
                <div className={styles.imageUrl}>
                </div>
              )}
            </div>
          </div>
          <div className={styles.inputs}>
            <div>
              <div className={styles.divWrapper}>
                <label>Name</label>
                <input type="text" name="name" value={gameInfo.name} onChange={handleChange} className={errors.name && styles.error} />
                {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
              </div>
            </div>
            <div>
              <div className={styles.divWrapper}>
                <label>Description</label>
                <textarea name="description" value={gameInfo.description} onChange={handleChange} className={errors.description && styles.error}></textarea>
                {errors.description && <div className={styles.errorMessage}>{errors.description}</div>}
              </div>
            </div>
            <div>
              <div className={styles.divWrapper}>
                <label>Released Date</label>
                <input type="date" name="releasedDate" value={gameInfo.releasedDate} onChange={handleChange} className={errors.released_date && styles.error} />
                {errors.releasedDate && <div className={styles.errorMessage}>{errors.releasedDate}</div>}
              </div>
            </div>
            <div>
              <div className={styles.divWrapper}>
                <label>Rating</label>
                <input placeholder='1-10' type="number" name="rating" value={gameInfo.rating} onChange={handleChange} className={errors.rating && styles.error} />
                {errors.rating && <div className={styles.errorMessage}>{errors.rating}</div>}
              </div>
            </div>
            <div>
              <button type="submit">Save</button>
            </div>
          </div>
          <div>
            <div>
              <div className={styles.genresWrapper}>
                <label className={styles.genreTitle}>Genres</label>
                <div className={styles.genresNames}>
                  {genres.map((genre, index) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <span onClick={() => handleSelectedGenre(genre)} className={`${styles.genreName} ${isSelected ? styles.selectedGenre : ''}`} key={index}>
                        {genre}
                      </span>
                    );
                  })}
                </div>
                {errors.genres && <div className={styles.errorMessage}>{errors.genres}</div>}
              </div>
            </div>
            <div>
              <div className={styles.genresWrapper}>
                <label className={styles.genreTitle}>Platforms</label>
                <div className={styles.genresNames}>
                  {platforms.map((platform, index) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <span onClick={() => handleSelectedPlatform(platform)} className={`${styles.genreName} ${isSelected ? styles.selectedGenre : ''}`} key={index}>
                        {platform}
                      </span>
                    );
                  })}
                </div>
                {errors.platforms && <div className={styles.errorMessage}>{errors.platforms}</div>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Create;