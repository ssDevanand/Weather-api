const express = require('express');
const app = express();
const config = require('../config/env.json');

const apiKey = config.WEATHER_API_KEY;

app.use(express.json());

    const fetchWeather = async (req, res) => {
    const cities = req.body; 

    if (!Array.isArray(cities)) {
        return res.status(400).json({ error: "Expected an array of city names." });
    }

    const dateSet = new Set(); 

    // Map over the cities array to create an array of pending Promises
    const weatherPromises = cities.map(async (city) => {
        try {
            const url =  config.tomorrowApiUrl +`location=${encodeURIComponent(city)}&apikey=${apiKey}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept-encoding': 'deflate, gzip, br',
                    'accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`Failed to fetch weather for ${city}: ${response.statusText}`);
                return null; 
            }

            const jsonResponse = await response.json();
            const forecast = jsonResponse?.timelines?.daily;
            const obj = { city: city };

            if (forecast) {
                let count = 1;
                for (const day of forecast) {
                    const output = day.time.split('T')[0];
                    dateSet.add(output); 

                    obj[`day${count}`] = {
                        AvgTemp: day.values?.temperatureAvg,
                        MinTemp: day.values?.temperatureMin,
                        MaxTemp: day.values?.temperatureMax
                    };
                    count++;
                }
            }
            
            return obj; 

        } catch (error) {
            console.error(`Error processing ${city}:`, error);
            return null; // Catch network errors so they don't crash Promise.all
        }
    });

    // Await all promises concurrently
    const results = await Promise.all(weatherPromises);

    // Build and return the final response
    const weatherObject = {
        dates: Array.from(dateSet),
        WeatherInfo: results
    };

    return res.json(weatherObject);
}

app.post('/weatherforecast', fetchWeather);

module.exports = app;