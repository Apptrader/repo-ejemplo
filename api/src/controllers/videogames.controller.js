const { Videogame, Genres } = require("../db");
const axios = require("axios");
require('dotenv').config();
const apiKey = process.env.API_KEY

//funcion para hacer el fetch

const fetchVideogames = async () => {
    
    let dbGames = await Videogame.findAll();


    let apiVideoGames = [];
    let nextPage = `https://api.rawg.io/api/games?key=${apiKey}`;
    
    while (apiVideoGames.length < 100) {
        const response = await axios.get(nextPage);
        const { results, next } = response.data;
        apiVideoGames = apiVideoGames.concat(results);
        if (next) {
            nextPage = next;
        } else {
            break;
        }
    }

    let allVideoGames = [dbGames.concat(apiVideoGames)]

    return allVideoGames;
};

//controlador para llamar a todos los juegos

const getVideogames = async (req, res) => {
    try {
        const allVideogames = await fetchVideogames();
        res.status(200).json(allVideogames);
    } catch (error) {
        res.status(400).json(error);
    }
};

 //controlador para traer games por id de la api

const getGameById = async (req, res) => {
    const  id  = req.params.idVideogames
    try {
        if (!id) {
            return res.status(500).json("invalid game ID")
        }
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);
        const gameData = response.data;
        res.status(200).json(gameData);
    } catch (error) {
        res.status(500).json(error);
    }
}

//ruta para buscar por nombres

const getByNames = async (req, res) => {
    const query = req.query.name;
    console.log(query)
    try {
        const response = await axios.get(`https://api.rawg.io/api/games?key=${apiKey}&search=${query}`);
        const apiGames = response.data;

        res.status(200).json(apiGames);
    } catch (error) {
        res.status(500).json(error);
    }

}

//crear juego

const addGame = async (req, res) => {

    const { name, image, platforms, description, releasedDate, rating, genres, apiGame } = req.body;
    console.log(req.body);

    if (!name || !image || !platforms || !description || !releasedDate || !rating || !genres || !apiGame) {
        return res.status(400).json({ error: 'Incomplete information' });
    }

    const _name = name.toLowerCase();

    try {
       
        const videogames = await fetchVideogames();

        
        const repeatGame = videogames[0].find(game => game.name.toLowerCase() === _name);
        if (repeatGame) {
            return res.status(400).json({ error: 'Game already exists' });
        }

        
        const platformsString = JSON.stringify(platforms);

        
        const [newGame, created] = await Videogame.findCreateFind({
            where: { name: _name },
            defaults: {
                name: _name,
                image,
                platforms: platformsString,
                description,
                releaseDate: releasedDate,
                rating,
                ApiGame: apiGame
            }
        });

        
        for (const genreName of genres) {
            const [genre, created] = await Genres.findCreateFind({
                where: { name: genreName }
            });

            newGame.addGenre(genre);
        }

        const respo = {
            error: 0,
            game: newGame
        }

        res.status(200).json(respo);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//controlador para buscar un juego de la db por id

const getDbGameById = async (req, res) => {
    console.log(req.params)
    const id = req.params.idVideogames
    console.log(id)
    try {
        const game = await Videogame.findOne({
            where: { id: id }
        });

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const controllers = { getVideogames, getGameById, getByNames, addGame, getDbGameById }
module.exports = controllers