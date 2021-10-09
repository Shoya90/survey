const answerService = require('../service/answer.service')
const surveyService = require('../service/survey.service')

async function answerSurvey(surveyId, answer) {
    const survey = await surveyService.getSurvey(surveyId)

    if(!survey.options.includes(answer)) {
        const err = new Error('Invalid answer')
        err.status = 400
        throw err
    }

    const answerId = await answerService.answerSurvey(surveyId, answer)
    return answerId
}

async function getSurveyAnswers(surveyId) {
    const survey = await surveyService.getSurvey(surveyId)
    const answers = await answerService.getAnswersBySurveyId(surveyId)

    return {
        survey,
        answers
    }
}

module.exports = {
    answerSurvey,
    getSurveyAnswers
}