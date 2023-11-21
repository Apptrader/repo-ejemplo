import { GET_GAMES, SET_GENRES, SET_PLATFORMS, SET_IS_API_GAME, SET_FILTER_GENRE_GAMES } from '../actions/actionTypes'

const initialState = {

    videogames: [],
    platforms: [],
    genres: [],
    isApiGame: false
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GAMES:
            return {
                ...state,
                videogames: [action.payload],
            }
        case SET_GENRES:
            return {
                ...state,
                genres: action.payload,
            }
        case SET_PLATFORMS:
        default:
            return state;
    }
}

export default rootReducer;