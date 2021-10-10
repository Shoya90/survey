const test = require('ava')
const mongoose = require('mongoose')

const answerService = require('../../src/service/answer.service')
const answerModel = require('../../src/model/answer.model')

test.before(async () => {
    const randomDbName = Math.random().toString(36).substring(7)
    const mongoConnectionString = process.env.MONGO_CONNECTION_STRING || 'mongodb:27017'
    await mongoose.connect(`mongodb://${mongoConnectionString}/test-${randomDbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
})

test.beforeEach(async () => {
    await answerModel.deleteMany({})
})

test.after(async () => {
    await mongoose.connection.db.dropDatabase()
})

test.serial('answerSurvey creates new answer and returns id', async t => {
    const surveyId = mongoose.Types.ObjectId()

    const res = await answerService.answerSurvey(surveyId, 'banana')

    t.true(mongoose.Types.ObjectId.isValid(res))

    const allAnswers = await answerModel.find()
    t.is(allAnswers.length, 1)
})

test.serial('getAnswersBySurveyId returns restuls', async t => {
    // create some answers
    const surveyId = mongoose.Types.ObjectId()
    const anotherSurveyId = mongoose.Types.ObjectId()

    await answerService.answerSurvey(surveyId, 'banana')
    await answerService.answerSurvey(surveyId, 'apple')
    await answerService.answerSurvey(surveyId, 'ananas')

    await answerService.answerSurvey(anotherSurveyId, 'tiger')

    // get answers
    const res = await answerService.getAnswersBySurveyId(surveyId)
    
    t.is(res.length, 3)

    for(let index in res) {
        t.true(res[index].surveyId == surveyId)
    }

    t.true(res[0].answer == 'banana')
    t.true(res[1].answer == 'apple')
    t.true(res[2].answer == 'ananas')
})

test.serial('getAnswersBySurveyId throws error for invalid surveyId', async t => {
    const error = await t.throwsAsync(answerService.getAnswersBySurveyId('invalid-id'))
    
    t.is(error.message, 'No survey found for this id')
    t.is(error.status, 404)
})