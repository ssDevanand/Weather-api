const express = require('express');
const app = express();
const citySearchService = require('../services/CityService');
const fetchWeather = require('../services/weather');

app.get('/search',citySearchService.citySearch);

// app.post('/weatherforecast', fetchWeather);

module.exports = app;