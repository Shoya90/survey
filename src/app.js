const express = require('express')
const http = require('http')
const { errors} = require('celebrate')

const surveyRouter = require('./routes/survey.route')
const answerRouter = require('./routes/answer.route')

require('./init/mongo')

const app = express()
const server = http.createServer(app)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/-/ping', (req, res) => res.sendStatus(200).end())

app.use('/api/v1/survey', surveyRouter)
app.use('/api/v1/answer', answerRouter)

app.use(errors()) // validation error handler
app.use(errorHandler)

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    const status = err.status || err.code || 500

    res.status(status)
    res.send({
        statusCode: status,
        message: status == 500 ? 'server error' : err.message,
        error: http.STATUS_CODES[status]
    })
}

module.exports = {
    app,
    server
}