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

test.serial('answerSurvey creates and returns new answer', async t => {
    const surveyId = mongoose.Types.ObjectId()

    const res = await answerService.answerSurvey(surveyId, 'banana')

    t.is(res.answer, 'banana')
    t.is(res.surveyId, surveyId.toHexString())

    const allAnswers = await answerModel.find()
    t.is(allAnswers.length, 1)
})

test.serial('getAnswersBySurveyId returns paginated restuls', async t => {
    // create some answers
    const surveyId = mongoose.Types.ObjectId()
    const anotherSurveyId = mongoose.Types.ObjectId()

    await answerService.answerSurvey(surveyId, 'banana')
    await answerService.answerSurvey(surveyId, 'apple')
    await answerService.answerSurvey(surveyId, 'ananas')

    await answerService.answerSurvey(anotherSurveyId, 'tiger')

    // get answers
    const res = await answerService.getAnswersBySurveyId(surveyId)
    t.is(res.answers.length, 3)

    for(let index in res.answers) {
        t.true(res.answers[index].surveyId == surveyId)
    }

    t.true(res.answers[0].answer == 'ananas')
    t.true(res.answers[1].answer == 'apple')
    t.true(res.answers[2].answer == 'banana')

    t.deepEqual(res.pagination, {
        totalDocs: 3,
        limit: 100,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null 
    })
})

test.serial('getAnswersBySurveyId throws error for invalid surveyId', async t => {
    const error = await t.throwsAsync(answerService.getAnswersBySurveyId('invalid-id'))
    
    t.is(error.message, 'No survey found for this id')
    t.is(error.status, 404)
})