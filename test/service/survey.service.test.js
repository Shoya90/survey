const test = require('ava')
const mongoose = require('mongoose')

const surveyService = require('../../src/service/survey.service')
const surveyModel = require('../../src/model/survey.model')

test.before(async () => {
    const randomDbName = Math.random().toString(36).substring(7)
    const mongoConnectionString = process.env['MONGO_CONNECTION_STRING'] || 'mongodb:27017'
    await mongoose.connect(`mongodb://${mongoConnectionString}/test-${randomDbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
})

test.beforeEach(async () => {
    await surveyModel.deleteMany({})
})

test.after(async () => {
    await mongoose.connection.db.dropDatabase()
})

test.serial('createSurvey creates survey and retunrs id', async t => {
    const survey = {
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas']
    }

    const res = await surveyService.createSurvey(survey)
    t.true(mongoose.Types.ObjectId.isValid(res))

    const allSurveys = await surveyModel.find()
    t.is(allSurveys.length, 1)
})

test.serial('getSurvey finds and returns survey', async t => {
    // create new survey
    const survey = {
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas']
    }

    const newSurvey = await surveyService.createSurvey(survey)

    // get survey
    const res = await surveyService.getSurvey(newSurvey._id)

    t.is(res.question, 'what is your favorite friut?')
    t.deepEqual(res.options, ['banana', 'apple', 'ananas'])
})

test.serial('getSurvey throws error for invalid surveyId', async t => {
    const error = await t.throwsAsync(surveyService.getSurvey('invalid-id'))
    
    t.is(error.message, 'No survey found for this id')
    t.is(error.status, 404)
})