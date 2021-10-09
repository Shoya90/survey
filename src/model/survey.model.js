const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String }] 
}, { timestamps: true })

module.exports = mongoose.model('survey', schema)