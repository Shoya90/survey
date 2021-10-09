const test = require('ava')
const sinon = require('sinon')
const request = require('supertest')

const answerController = require('../../src/controller/answer.controller')

let app

test.beforeEach(() => {
    const appModule = require('../../src/app')
    app = appModule.app
})

test.afterEach(() => {
    sinon.restore()
})

test.serial('POST /answer/:surveyId/new creates an answer and returns the answerId', async t => {
    const surveyId = 'survey-id'
    const answerId = 'answer-id'

    const answerSurveyStub = sinon.stub(answerController, 'answerSurvey').returns(answerId)

    const res = await request(app).post(`/api/v1/answer/${surveyId}/new`).send({
        answer: 'banana'
    })

    t.is(answerSurveyStub.callCount, 1)
    t.is(answerSurveyStub.firstCall.args[0], surveyId)
    t.is(answerSurveyStub.firstCall.args[1], 'banana')

    t.is(res.status, 200)
    t.deepEqual(res.body, {
        _id: answerId
    })
})

test.serial('POST /answer/:surveyId/new returns error if validation fails', async t => {
    const surveyId = 'survey-id'
    const answerSurveyStub = sinon.stub(answerController, 'answerSurvey')

    const res = await request(app).post(`/api/v1/answer/${surveyId}/new`) // empty body

    t.is(answerSurveyStub.callCount, 0)

    t.is(res.status, 400)
    t.is(res.body.message, 'Validation failed')
    t.regex(res.body.validation.body.message, /"answer" is required/)
})

test.serial('POST /answer/:surveyId/new returns error for invalid surveyId', async t => {
    const surveyId = 'invalid-id'

    const err = new Error('No survey found for this id')
    err.status = 404
    
    const answerSurveyStub = sinon.stub(answerController, 'answerSurvey').throws(err)

    const res = await request(app).post(`/api/v1/answer/${surveyId}/new`).send({
        answer: 'banana'
    })

    t.is(answerSurveyStub.callCount, 1)
    t.is(answerSurveyStub.firstCall.args[0], surveyId)

    t.is(res.status, 404)
    t.is(res.body.message, 'No survey found for this id')
    t.is(res.body.error, 'Not Found')
})

test.serial('GET /answer/:surveyId/results returns question and all answers', async t => {
    const surveyId = 'survey-id'
    const expectedResults = {
        question: 'some questions?',
        answers: [
            {
                answer: 'a',
                answerId: 'id-1'
            },
            {
                answer: 'b',
                answerId: 'id-2'
            }
        ]
    }

    const getSurveyAnswersStub = sinon.stub(answerController, 'getSurveyAnswers').returns(expectedResults)

    const res = await request(app).get(`/api/v1/answer/${surveyId}/results`)

    t.is(getSurveyAnswersStub.callCount, 1)
    t.is(getSurveyAnswersStub.firstCall.args[0], surveyId)

    t.is(res.status, 200)
    t.deepEqual(res.body, expectedResults)
})

test.serial('GET /answer/:surveyId/results returns error for invalid answer', async t => {
    const surveyId = 'survey-id'

    const err = new Error('Invalid answer')
    err.status = 400
    
    const getSurveyAnswersStub = sinon.stub(answerController, 'getSurveyAnswers').throws(err)

    const res = await request(app).get(`/api/v1/answer/${surveyId}/results`).send({
        answer: 'invalid answer'
    })

    t.is(getSurveyAnswersStub.callCount, 1)
    t.is(getSurveyAnswersStub.firstCall.args[0], surveyId)

    t.is(res.status, 400)
    t.is(res.body.message, 'Invalid answer')
    t.is(res.body.error, 'Bad Request')
})
