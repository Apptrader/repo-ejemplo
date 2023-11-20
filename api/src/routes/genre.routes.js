const { Router } = require('express');
const { getGenres, getApiGenres } = require('../controllers/genres.controller');


const genresRouter = Router()

genresRouter.get("/genres", getGenres)
genresRouter.get("/genres/:id", getApiGenres)

module.exports = genresRouter