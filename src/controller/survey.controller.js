const surveyService = require('../service/survey.service')

async function createSurvey(survey) {
    const surveyId = await surveyService.createSurvey(survey)
    return surveyId
}

module.exports = {
    createSurvey
}