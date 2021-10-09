const ObjectId = require('mongoose').Types.ObjectId

const answerModel = require('../model/answer.model')

async function answerSurvey(surveyId, answer) {
    const newAnswer = await answerModel.create({
        surveyId,
        answer
    })
    return newAnswer._id
}

async function getAnswersBySurveyId(surveyId) {
    if(!ObjectId.isValid(surveyId)) {
        const err = new Error('No survey found for this id')
        err.code = 404
        throw err
    }

    const answers = await answerModel.find({ surveyId })
    return answers
}

module.exports = {
    answerSurvey,
    getAnswersBySurveyId
}