const test = require('ava')
const sinon = require('sinon')
const request = require('supertest')

const surveyController = require('../../src/controller/survey.controller')

let app

test.beforeEach(() => {
    const appModule = require('../../src/app')
    app = appModule.app
})

test.afterEach(() => {
    sinon.restore()
})

test.serial('POST /survey creates and returns a survey', async t => {
    const survey = {
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas'],
        _id: 'some-id'
    }

    const createSurveyStub = sinon.stub(surveyController, 'createSurvey').returns(survey)

    const res = await request(app).post(`/api/v1/survey`).send({
        question: 'some question?',
        options: ['opt. 1', 'opt. 2', 'opt. 3']
    })

    t.is(createSurveyStub.callCount, 1)
    t.deepEqual(createSurveyStub.firstCall.args[0], {
        question: 'some question?',
        options: ['opt. 1', 'opt. 2', 'opt. 3']
    })

    t.is(res.status, 200)
    t.deepEqual(res.body, {
        data: {
            survey
        }
    })
})

test.serial('POST /survey returns error if validation fails', async t => {
    const createSurveyStub = sinon.stub(surveyController, 'createSurvey')

    const res = await request(app).post(`/api/v1/survey`).send({
        options: ['opt. 1', 'opt. 2', 'opt. 3']
    })

    t.is(createSurveyStub.callCount, 0)

    t.is(res.status, 400)
    t.is(res.body.message, 'Validation failed')
    t.regex(res.body.validation.body.message, /"question" is required/)

    const res2 = await request(app).post(`/api/v1/survey`).send({
        question: 'some question?'
    })

    t.is(createSurveyStub.callCount, 0)

    t.is(res2.status, 400)
    t.is(res2.body.message, 'Validation failed')
    t.regex(res2.body.validation.body.message, /"options" is required/)
})


test.serial('POST /survey/:surveyId/answer creates and returns an answer', async t => {
    const surveyId = 'survey-id'
    const answer = {
        answer: 'banana',
        surveyId,
        _id: 'some-id'
    }

    const answerSurveyStub = sinon.stub(surveyController, 'answerSurvey').returns(answer)

    const res = await request(app).post(`/api/v1/survey/${surveyId}/answer`).send({
        answer: 'banana'
    })

    t.is(answerSurveyStub.callCount, 1)
    t.is(answerSurveyStub.firstCall.args[0], surveyId)
    t.is(answerSurveyStub.firstCall.args[1], 'banana')

    t.is(res.status, 200)
    t.deepEqual(res.body, {
        data: {
            answer
        }
    })
})

test.serial('POST /survey/:surveyId/answer returns error if validation fails', async t => {
    const surveyId = 'survey-id'
    const answerSurveyStub = sinon.stub(surveyController, 'answerSurvey')

    const res = await request(app).post(`/api/v1/survey/${surveyId}/answer`) // empty body

    t.is(answerSurveyStub.callCount, 0)

    t.is(res.status, 400)
    t.is(res.body.message, 'Validation failed')
    t.regex(res.body.validation.body.message, /"answer" is required/)
})

test.serial('POST /survey/:surveyId/answer returns error for invalid surveyId', async t => {
    const surveyId = 'invalid-id'

    const err = new Error('No survey found for this id')
    err.status = 404
    
    const answerSurveyStub = sinon.stub(surveyController, 'answerSurvey').throws(err)

    const res = await request(app).post(`/api/v1/survey/${surveyId}/answer`).send({
        answer: 'banana'
    })

    t.is(answerSurveyStub.callCount, 1)
    t.is(answerSurveyStub.firstCall.args[0], surveyId)

    t.is(res.status, 404)
    t.is(res.body.message, 'No survey found for this id')
    t.is(res.body.error, 'Not Found')
})

test.serial('GET /survey/:surveyId/results returns paginated list of answers', async t => {
    const surveyId = 'survey-id'
    const expectedResults = {
        answers: [
            {
                answer: 'a',
                answerId: 'id-1'
            },
            {
                answer: 'b',
                answerId: 'id-2'
            }
        ],
        pagination: {
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
    }

    const getSurveyAnswersStub = sinon.stub(surveyController, 'getSurveyAnswers').returns(expectedResults)

    const res = await request(app).get(`/api/v1/survey/${surveyId}/results?page=1&limit=20`)

    t.is(getSurveyAnswersStub.callCount, 1)
    t.is(getSurveyAnswersStub.firstCall.args[0], surveyId)
    t.deepEqual(getSurveyAnswersStub.firstCall.args[1], { page: 1, limit: 20 })

    t.is(res.status, 200)
    t.deepEqual(res.body, {
        data: expectedResults
    })
})

test.serial('GET /survey/:surveyId/results returns error for invalid answer', async t => {
    const surveyId = 'survey-id'

    const err = new Error('Invalid answer')
    err.status = 400
    
    const getSurveyAnswersStub = sinon.stub(surveyController, 'getSurveyAnswers').throws(err)

    const res = await request(app).get(`/api/v1/survey/${surveyId}/results`).send({
        answer: 'invalid answer'
    })

    t.is(getSurveyAnswersStub.callCount, 1)
    t.is(getSurveyAnswersStub.firstCall.args[0], surveyId)

    t.is(res.status, 400)
    t.is(res.body.message, 'Invalid answer')
    t.is(res.body.error, 'Bad Request')
})
