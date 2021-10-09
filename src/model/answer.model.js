const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    surveyId: { type: String, required: true },
    answer: { type: String, required: true }
}, { timestamps: true })

schema.index({ surveyId: 1 })

module.exports = mongoose.model('answer', schema)