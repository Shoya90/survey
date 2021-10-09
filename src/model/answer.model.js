const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    surveyId: { type: String, required: true },
    answer: { type: String, required: true }
})

module.exports = mongoose.model('answer', schema)