const { conn, Genres, Videogame } = require("../db");
const axios = require("axios");
require('dotenv').config();
const apiKey = process.env.API_KEY

const getGenres = async (req, res) => {
    try {
      console.log("papa");
      const response = await axios.get(`https://api.rawg.io/api/genres?key=${apiKey}`);
      const data = response.data.results;
      const genres = [];
      
      for (let i = 0; i < data.length; i++) {
        genres.push(data[i].name);
      }
  
      for (let i = 0; i < genres.length; i++) {
         await Genres.findOrCreate({
          where: { name: genres[i] }
        });
      }

      const findGenres = await Genres.findAll()
      const sendGenres = []

      for (let i = 0; i < findGenres.length; i++) {
        sendGenres.push(findGenres[i].name)
      }

      res.status(200).json(sendGenres)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
  };

  const getApiGenres = async (req, res) => {
    const { id } = req.params;
  
    try {
     
      const genres = await Genres.findAll({
        include: [
          {
            model: Videogame,
            where: { id: id },
          },
        ],
      });
  
    
      res.status(200).json(genres);
    } catch (error) {
      
      console.error('Error al obtener géneros:', error);
      res.status(500).json({ error: 'Error al obtener géneros' });
    }
  };

const controllers = {getGenres, getApiGenres}
module.exports = controllers
