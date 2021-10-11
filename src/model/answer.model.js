const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

mongoosePaginate.paginate.options = {
    page: 1,
    limit: 100,
    customLabels: {
        docs: 'answers',
        meta: 'pagination',
    },
    leanWithId: false,
    lean: true,
    sort: { createdAt: -1 }
}

const schema = new mongoose.Schema({
    surveyId: { type: String, required: true },
    answer: { type: String, required: true }
}, { timestamps: true })

schema.index({ surveyId: 1 })
schema.plugin(mongoosePaginate)

module.exports = mongoose.model('answer', schema)