const mongoose = require('mongoose')

// connect to mongo
mongoose.connect('mongodb://mongodb:27017/survey-db' , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

