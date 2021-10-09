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

test.serial('POST /survey/new creates the survey and returns surveyId', async t => {
    const surveyId = 'survey-id'

    const createSurveyStub = sinon.stub(surveyController, 'createSurvey').returns(surveyId)

    const res = await request(app).post(`/api/v1/survey/new`).send({
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
        _id: surveyId
    })
})

test.serial('POST /survey/new returns error if validation fails', async t => {
    const createSurveyStub = sinon.stub(surveyController, 'createSurvey')

    const res = await request(app).post(`/api/v1/survey/new`).send({
        options: ['opt. 1', 'opt. 2', 'opt. 3']
    })

    t.is(createSurveyStub.callCount, 0)

    t.is(res.status, 400)
    t.is(res.body.message, 'Validation failed')
    t.regex(res.body.validation.body.message, /"question" is required/)

    const res2 = await request(app).post(`/api/v1/survey/new`).send({
        question: 'some question?'
    })

    t.is(createSurveyStub.callCount, 0)

    t.is(res2.status, 400)
    t.is(res2.body.message, 'Validation failed')
    t.regex(res2.body.validation.body.message, /"options" is required/)
})
