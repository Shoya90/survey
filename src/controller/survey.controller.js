const surveyService = require('../service/survey.service')
const answerService = require('../service/answer.service')

async function createSurvey(survey) {
    const newSurvey = await surveyService.createSurvey(survey)
    return newSurvey
}

async function getSurveyAnswers(surveyId, pagination) {
    const survey = await surveyService.getSurvey(surveyId)
    if(!survey) {
        const err = new Error('No survey found for this id')
        err.status = 404
        throw err
    }
    const answers = await answerService.getAnswersBySurveyId(surveyId, pagination)

    return answers
}

async function answerSurvey(surveyId, answer) {
    const survey = await surveyService.getSurvey(surveyId)

    if(!survey) {
        const err = new Error('No survey found for this id')
        err.status = 404
        throw err
    }

    if(!survey.options.includes(answer)) {
        const err = new Error('Invalid answer')
        err.status = 400
        throw err
    }

    const newAnswer = await answerService.answerSurvey(surveyId, answer)
    return newAnswer
}

module.exports = {
    answerSurvey,
    createSurvey,
    getSurveyAnswers
}