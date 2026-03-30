const cities = require('../utils/constant.json');

const citySearch = async (req, res) => {
    try {
        
        let city = req.query?.city;
        
        const filteredCities = cities?.CityList.filter(c => c.toLowerCase().includes(city?.toLowerCase()));
        res.status(200).json({
            success: true,
            data: filteredCities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch city list',
            error: error.message
        });
    }
};

module.exports = {
    citySearch
};