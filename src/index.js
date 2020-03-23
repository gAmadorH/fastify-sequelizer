const fp = require('fastify-plugin')
const Sequelize = require('sequelize')

const logs = {
  connection: {
    success: 'DATABASE: ready',
    error: 'DATABASE: error'
  },
  closure: {
    success: 'DATABASE: disconnected',
    error: 'DATABASE: no disconnected'
  }
}

async function plugin(fastify, opts) {
  const { url, options } = opts.database
  const { logs: customLogs = {} } = opts
  let sequelize = null

  Object.assign(logs, customLogs)

  if (options.logging) {
    options.logging = (msg) => fastify.log.debug(msg)
  }

  try {
    sequelize = new Sequelize(url, options)
    await sequelize.authenticate()

    fastify.log.info(logs.connection.success)
  } catch (err) {
    fastify.log.error(logs.connection.error)

    throw err
  }

  // if the fastify is closed, the db will also be closed
  fastify.addHook('onClose', (app, done) => {
    app.sequelize.close().then(() => {
      app.log.info(logs.closure.success)

      done()
    }).catch((err) => {
      app.log.error(logs.closure.error)

      done(err)
    })
  })

  fastify.decorate('sequelize', sequelize)
  fastify.decorate('Sequelize', Sequelize)
}

module.exports = fp(plugin, {
  fastify: '>=0.13.1'
})
