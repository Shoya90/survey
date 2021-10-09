const config = {
    PORT: process.env.PORT || 3000,
    ENV: process.ENV || 'development',
    CONNECTION_STRING: process.env.CONNECTION_STRING || 'mongodb://mongodb:27017/survey-db'
}

module.exports = config
