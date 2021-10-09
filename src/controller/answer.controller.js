const answerService = require('../service/answer.service')
const surveyService = require('../service/survey.service')

async function answerSurvey(surveyId, answer) {
    const answerId = await answerService.answerSurvey(surveyId, answer)
    return answerId
}

async function getSurveyAnswers(surveyId) {
    const survey = await surveyService.getSurvey(surveyId)
    const answers = await answerService.getAnswersBySurveyId(surveyId)

    return {
        question: survey.question,
        surveyId: survey._id,
        answers: answers.map(a => ({ answer: a.answer, answerId: a._id }))
    }
}

module.exports = {
    answerSurvey,
    getSurveyAnswers
}