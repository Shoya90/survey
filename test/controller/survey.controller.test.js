const test = require('ava')
const sinon = require('sinon')

const surveyController = require('../../src/controller/survey.controller')
const surveyService = require('../../src/service/survey.service')
const answerService = require('../../src/service/answer.service')

test.afterEach(() => {
    sinon.restore()
})

test.serial('createSurvey creates and returns the survey', async t => {
    const survey = {
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas'],
        _id: 'some-id'
    }

    const createSurveyStub = sinon.stub(surveyService, 'createSurvey').returns(survey)

    const res = await surveyController.createSurvey({
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas']
    })

    t.is(createSurveyStub.callCount, 1)
    t.deepEqual(createSurveyStub.firstCall.args[0], {
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas']
    })

    t.is(res, survey)
})

test.serial('answerSurvey creates and returns a new answer', async t => {
    const surveyId = 'survey-id'
    const answer = {
        answer: 'banana',
        surveyId,
        _id: 'some-id'
    }

    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').returns({
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas']
    })

    const answerSurveyStub = sinon.stub(answerService, 'answerSurvey').returns(answer)

    const res = await surveyController.answerSurvey(surveyId, 'banana')

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(answerSurveyStub.callCount, 1)
    t.is(answerSurveyStub.firstCall.args[0], surveyId)
    t.is(answerSurveyStub.firstCall.args[1], 'banana')

    t.is(res, answer)
})

test.serial('answerSurvey throws error if survey id is invalid', async t => {
    const surveyId = 'invalid-id'

    const err = new Error('No survey found for this id')
    err.status = 404
        
    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').throws(err)

    const answerSurveyStub = sinon.stub(answerService, 'answerSurvey')

    const error = await t.throwsAsync(surveyController.answerSurvey(surveyId, 'banana'))

    t.is(error.message, 'No survey found for this id')
    t.is(error.status, 404)

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(answerSurveyStub.callCount, 0)
})

test.serial('answerSurvey throws error if answer is not allowed', async t => {
    const surveyId = 'invalid-id'

    const err = new Error('Invalid answer')
    err.status = 400
        
    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').throws(err)

    const answerSurveyStub = sinon.stub(answerService, 'answerSurvey')

    const error = await t.throwsAsync(surveyController.answerSurvey(surveyId, 'potato'))

    t.is(error.message, 'Invalid answer')
    t.is(error.status, 400)

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(answerSurveyStub.callCount, 0)
})

test.serial('getSurveyAnswers returns results', async t => {
    const surveyId = 'survey-id'
    const expectedResults = {
        answers: [
            {
                _id: 'answer-id-1',
                answer: 'banana'
            },
            {
                _id: 'answer-id-2',
                answer: 'apple'
            }
        ],
        totalDocs: 1,
        limit: 20,
        page: 1,
        totalPages: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
    }

    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').returns({
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas'],
        _id: surveyId
    })

    const getAnswersBySurveyIdStub = sinon.stub(answerService, 'getAnswersBySurveyId')
        .returns(expectedResults)

    const res = await surveyController.getSurveyAnswers(surveyId)

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(getAnswersBySurveyIdStub.callCount, 1)
    t.is(getAnswersBySurveyIdStub.firstCall.args[0], surveyId)

    t.deepEqual(res, expectedResults)
})

test.serial('getSurveyAnswers throws error for invalid surveyId', async t => {
    const surveyId = 'invalid-id'

    const err = new Error('No survey found for this id')
    err.status = 404
        
    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').throws(err)

    const getAnswersBySurveyIdStub = sinon.stub(answerService, 'getAnswersBySurveyId')

    const error = await t.throwsAsync(surveyController.getSurveyAnswers(surveyId))

    t.is(error.message, 'No survey found for this id')
    t.is(error.status, 404)

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(getAnswersBySurveyIdStub.callCount, 0)
})

test.serial('getSurveyAnswers throws error for if survey not found', async t => {
    const surveyId = 'invalid-id'
        
    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').returns(null)

    const getAnswersBySurveyIdStub = sinon.stub(answerService, 'getAnswersBySurveyId')

    const error = await t.throwsAsync(surveyController.getSurveyAnswers(surveyId))

    t.is(error.message, 'No survey found for this id')
    t.is(error.status, 404)

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(getAnswersBySurveyIdStub.callCount, 0)
})