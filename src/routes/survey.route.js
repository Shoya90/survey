const { Router } = require('express')
const { celebrate, Joi, Segments } = require('celebrate')
require('express-async-errors')

// controller
const surveyController = require('../controller/survey.controller')

const router = new Router()

router.post('/new', celebrate({
    [Segments.BODY]: Joi.object().keys({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string())
    })
}), async (req, res) => {
    const { question, options } = req.body
    const surveyId = await surveyController.createSurvey({ question, options })

    res.send({
        _id: surveyId
    })
})

module.exports = router
