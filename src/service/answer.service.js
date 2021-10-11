const ObjectId = require('mongoose').Types.ObjectId

const answerModel = require('../model/answer.model')

async function answerSurvey(surveyId, answer) {
    const newAnswer = await answerModel.create({
        surveyId,
        answer
    })
    return newAnswer.toObject()
}

async function getAnswersBySurveyId(surveyId, pagination) {
    if(!ObjectId.isValid(surveyId)) {
        const err = new Error('No survey found for this id')
        err.status = 404
        throw err
    }

    const answers = await answerModel.paginate({ surveyId }, pagination)
    return answers
}

module.exports = {
    answerSurvey,
    getAnswersBySurveyId
}