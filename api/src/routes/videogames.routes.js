const { Router } = require('express');
const  {getVideogames, getGameById, getByNames, addGame, getDbGameById}  = require('../controllers/videogames.controller');

const videogamesRouter = Router()

videogamesRouter.get("/videogames", getVideogames)
videogamesRouter.get("/videogames/:idVideogames", getGameById)
videogamesRouter.get("/videogames/api/:idVideogames", getDbGameById)
videogamesRouter.get('/videogames/search/name', getByNames)
videogamesRouter.post("/videogames")
videogamesRouter.get('/nombres', getByNames)
videogamesRouter.post("/videogames/add", addGame)

module.exports = videogamesRouter