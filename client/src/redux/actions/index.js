import axios from 'axios'
import { GET_GAMES, SET_GENRES, SET_PLATFORMS} from './actionTypes';

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