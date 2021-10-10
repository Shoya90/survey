const test = require('ava')
const sinon = require('sinon')

const answerController = require('../../src/controller/answer.controller')
const answerService = require('../../src/service/answer.service')
const surveyService = require('../../src/service/survey.service')

test.afterEach(() => {
    sinon.restore()
})

test.serial('answerSurvey creates a new answer and returns the id', async t => {
    const surveyId = 'survey-id'
    const answerId = 'answer-id'

    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').returns({
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas']
    })

    const answerSurveyStub = sinon.stub(answerService, 'answerSurvey').returns(answerId)

    const res = await answerController.answerSurvey(surveyId, 'banana')

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(answerSurveyStub.callCount, 1)
    t.is(answerSurveyStub.firstCall.args[0], surveyId)
    t.is(answerSurveyStub.firstCall.args[1], 'banana')

    t.is(res, answerId)
})

test.serial('answerSurvey throws error if survey id is invalid', async t => {
    const surveyId = 'invalid-id'

    const err = new Error('No survey found for this id')
    err.status = 404
        
    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').throws(err)

    const answerSurveyStub = sinon.stub(answerService, 'answerSurvey')

    const error = await t.throwsAsync(answerController.answerSurvey(surveyId, 'banana'))

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

    const error = await t.throwsAsync(answerController.answerSurvey(surveyId, 'potato'))

    t.is(error.message, 'Invalid answer')
    t.is(error.status, 400)

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(answerSurveyStub.callCount, 0)
})

test.serial('getSurveyAnswers returns results', async t => {
    const surveyId = 'survey-id'

    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').returns({
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas'],
        _id: surveyId
    })

    const getAnswersBySurveyIdStub = sinon.stub(answerService, 'getAnswersBySurveyId').returns([
        {
            _id: 'answer-id-1',
            answer: 'banana'
        },
        {
            _id: 'answer-id-2',
            answer: 'apple'
        }
    ])

    const res = await answerController.getSurveyAnswers(surveyId)

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(getAnswersBySurveyIdStub.callCount, 1)
    t.is(getAnswersBySurveyIdStub.firstCall.args[0], surveyId)

    t.deepEqual(res, {
        survey: {
            question: 'what is your favorite friut?',
            options: ['banana', 'apple', 'ananas'],
            _id: surveyId
        },
        answers: [
            {
                _id: 'answer-id-1',
                answer: 'banana'
            },
            {
                _id: 'answer-id-2',
                answer: 'apple'
            }
        ]
    })
})

test.serial('getSurveyAnswers throws error for invalid surveyId', async t => {
    const surveyId = 'invalid-id'

    const err = new Error('No survey found for this id')
    err.status = 404
        
    const getSurveyStub = sinon.stub(surveyService, 'getSurvey').throws(err)

    const getAnswersBySurveyIdStub = sinon.stub(answerService, 'getAnswersBySurveyId')

    const error = await t.throwsAsync(answerController.getSurveyAnswers(surveyId))

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

    const error = await t.throwsAsync(answerController.getSurveyAnswers(surveyId))

    t.is(error.message, 'No survey found for this id')
    t.is(error.status, 404)

    t.is(getSurveyStub.callCount, 1)
    t.is(getSurveyStub.firstCall.args[0], surveyId)
    
    t.is(getAnswersBySurveyIdStub.callCount, 0)
})