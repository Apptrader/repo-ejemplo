import axios from 'axios'
import { GET_GAMES, SET_GENRES, SET_PLATFORMS, SET_IS_API_GAME, SET_FILTER_GENRE_GAMES } from './actionTypes';

export const getVideogames = () => {
  return async (dispatch) => {
    
    try {
      const data = await axios.get('http://localhost:3001/api/videogames');
      return dispatch({
        type: GET_GAMES,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getGenres = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get('http://localhost:3001/api/genres');
      return dispatch({
        type: SET_GENRES,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const getPlatforms = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get('http://localhost:3001/api/platforms');
      return dispatch({
        type: SET_PLATFORMS,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const setIsApiGame = (data) => {
  return {
    type: SET_IS_API_GAME,
    payload: data
  };
};



export const setFilterGenre = (genre, videogames) => {
  return async (dispatch) => {
    try {
      const _data = [];
      for (const game of videogames) {
        let response;
        if (isNaN(game.id)) {
          response = await axios.get(`http://localhost:3001/api/videogames/${game.id}`);
          const genres = response.data.genres;
          if (genres.includes(genre)) {
            _data.push(game);
          }
        } else {
          if (game.genres.some((g) => g.name === genre)) {
            _data.push(game);
          }
        }
      }
      dispatch({
        type: SET_FILTER_GENRE_GAMES,
        payload: _data,
      });
    } catch (error) {
      console.error(error);
    }
  };
};