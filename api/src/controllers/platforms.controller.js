const axios = require("axios");
require('dotenv').config();
const apiKey = process.env.API_KEY;

// no se puede usar la ruta de platforms, asi que extraigo la info del endpoint principal

const getPlatforms = async (req, res) => {
    try {

        const response = await axios.get(`https://api.rawg.io/api/games?key=${apiKey}`);
        const data = response.data.results;
        const platforms = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].platforms && data[i].platforms.length > 0) {
                const platformName = data[i].platforms[0].platform.name;
                if (!platforms.includes(platformName)) {
                    platforms.push(platformName);
                }
            }
        }

        console.log(platforms);
        res.status(200).json(platforms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const controllers = { getPlatforms };
module.exports = controllers;