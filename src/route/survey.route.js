const { Router } = require('express')
const { celebrate, Joi, Segments } = require('celebrate')
require('express-async-errors')

// controller
const surveyController = require('../controller/survey.controller')

const router = new Router()

router.post('/', celebrate({
    [Segments.BODY]: Joi.object().keys({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).required()
    })
}), async (req, res) => {
    const { question, options } = req.body
    const createdSurvey = await surveyController.createSurvey({ question, options })

    res.send({
        data: {
            survey: createdSurvey
        }
    })
})

router.post('/:surveyId/answer', celebrate({
    [Segments.BODY]: Joi.object().keys({
        answer: Joi.string().required()
    })
}), async (req, res) => {
    const { answer } = req.body
    const { surveyId } = req.params
    const createdAnswer = await surveyController.answerSurvey(surveyId, answer)

    res.send({
        data: {
            answer: createdAnswer
        }
    })
})


router.get('/:surveyId/results', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().default(1),
        limit: Joi.number().default(100)
    })
}), async (req, res) => {
    const { surveyId } = req.params
    const { page, limit } = req.query
    const pagination = { page, limit }
    const results = await surveyController.getSurveyAnswers(surveyId, pagination)
    res.send({
        data: results
    })
})

module.exports = router
