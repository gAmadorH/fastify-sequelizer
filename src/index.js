const fp = require('fastify-plugin')
const Sequelize = require('sequelize')

let logs = {}

function onClose(app, next) {
  app.sequelize.close().then(() => {
    app.log.info(logs.closure.success)
    next()
  }).catch((err) => {
    app.log.error(logs.closure.error)
    next(err)
  })
}

async function plugin(fastify, opts) {
  const { url, options } = opts.params
  logs = opts.logs
  let sequelize = null

  if (options.logging) {
    options.logging = (msg) => fastify.log.debug(msg)
  }

  try {
    sequelize = new Sequelize(url, options)

    await sequelize.authenticate()
  } catch (err) {
    fastify.log.error(logs.connection.error)
    throw err
  }

  // if the fastify is closed, the db will also be closed
  fastify.addHook('onClose', onClose)

  fastify.decorate('sequelize', sequelize)
  fastify.decorate('Sequelize', Sequelize)

  fastify.log.info(logs.connection.success)
}

module.exports = fp(plugin, {
  fastify: '>=0.13.1'
})
