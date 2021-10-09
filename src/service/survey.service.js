const ObjectId = require('mongoose').Types.ObjectId

const surveyModel = require ('../model/survey.model')

async function createSurvey(survey) {
    const newSurvey = await surveyModel.create(survey)
    return newSurvey._id
}

async function getSurvey(id) {
    if(!ObjectId.isValid(id)) {
        const err = new Error('No survey found for this id')
        err.code = 404
        throw err
    }

    const survey = await surveyModel.findById(id)
    return survey
}

module.exports = {
    createSurvey,
    getSurvey
}

