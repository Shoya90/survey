const openApiCofig = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Surveys',
        version: '1.0.0',
        description: 'Create and aswer surveys, fetch the results'
      },
      servers: [
          {
              url: `/api/v1`
          }
      ]
    },
    apis: ['./src/api-docs/*.yaml']
  }

module.exports = openApiCofig