const mongoose = require('mongoose')
const { CONNECTION_STRING } = require('../config')

// connect to mongo
mongoose.connect(CONNECTION_STRING , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

