const express = require('express');
const app = express();
const config = require('./config/env.json');

const weatherController = require('./controllers/weatherontroller');
const fetchWeather = require('./services/weather');
const cors = require('cors');

app.use(cors({
    origin: config.UiAppUrl,   
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/api', weatherController);
app.use('/api', fetchWeather);

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

