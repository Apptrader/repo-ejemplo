const { Router } = require('express');
const { getPlatforms } = require('../controllers/platforms.controller');



const platformsRouter = Router()

platformsRouter.get("/platforms", getPlatforms)

module.exports = platformsRouter