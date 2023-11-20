const { Videogame, Genres } = require("../db");
const axios = require("axios");
require('dotenv').config();
const apiKey = process.env.API_KEY

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

    let allVideoGames = [{api: apiVideoGames, db: dbGames}]

    return allVideoGames;
};

const getVideogames = async (req, res) => {
    try {
        const allVideogames = await fetchVideogames();
        res.status(200).json(allVideogames);
    } catch (error) {
        res.status(400).json(error);
    }
};

const searchVideogames = async (req, res) => {
    try {
        const allVideogames = await fetchVideogames();
        return allVideogames;
    } catch (error) {
        res.status(400).json(error);
    }
};

const getGameById = async (req, res) => {
    const  id  = req.params.idVideogames
    console.log(id)
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

const addGame = async (req, res) => {
    console.log("papa");
    const { name, image, platforms, description, releasedDate, rating, genres, apiGame } = req.body;
    console.log(req.body);

    if (!name || !image || !platforms || !description || !releasedDate || !rating || !genres || !apiGame) {
        return res.status(400).json({ error: 'Incomplete information' });
    }

    const _name = name.toLowerCase();

    try {
       
        const videogames = await searchVideogames(req, res);

        
        const repeatGame = videogames.find(game => game.name.toLowerCase() === _name);
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

const getApiGameById = async (req, res) => {
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


const controllers = { getVideogames, getGameById, getByNames, addGame, getApiGameById }
module.exports = controllers