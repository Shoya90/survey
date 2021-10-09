const { Router } = require('express')
const { celebrate, Joi, Segments } = require('celebrate')
require('express-async-errors')

// controller
const answerController = require('../controller/answer.controller')

const router = new Router()

router.post('/:surveyId/new', celebrate({
    [Segments.BODY]: Joi.object().keys({
        answer: Joi.string().required()
    })
}), async (req, res) => {
    const { answer } = req.body
    const { surveyId } = req.params
    const answerId = await answerController.answerSurvey(surveyId, answer)

    res.send({
        _id: answerId
    })
})

router.get('/:surveyId/results', async (req, res) => {
    const { surveyId } = req.params
    const results = await answerController.getSurveyAnswers(surveyId)
    res.send(results)
})

module.exports = router
