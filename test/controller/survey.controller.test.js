const test = require('ava')
const sinon = require('sinon')

const surveyController = require('../../src/controller/survey.controller')
const surveyService = require('../../src/service/survey.service')

test.afterEach(() => {
    sinon.restore()
})

test.serial('createSurvey creates survey and returns the id', async t => {
    const surveyId = 'survey-id'

    const createSurveyStub = sinon.stub(surveyService, 'createSurvey').returns(surveyId)

    const res = await surveyController.createSurvey({
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas']
    })

    t.is(createSurveyStub.callCount, 1)
    t.deepEqual(createSurveyStub.firstCall.args[0], {
        question: 'what is your favorite friut?',
        options: ['banana', 'apple', 'ananas']
    })

    t.is(res, surveyId)
})