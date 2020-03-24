# fastify-sequelizer

Fastify sequelize connection plugin

## Install

```bash
npm i -S fastify-sequelizer
```

## Register plugin

```js
const database = {
  // db url
  url: 'postgres://user:password@localhost:5432/my-db',
  // sequelize options
  options: {
    logging: true
  }
};

// logs for this super plugin
const log = {
  connection: {
    success: 'my super db is ready',
    error: 'error in my super db'
  },
  closure: {
    success: 'my super db is disconnected',
    error: 'my super db is not disconnected'
  }
};

fastify.register(require('fastify-sequelizer'), { database, logs });
```

## Usage

```js
fastify.sequelize

// or
fastify.Sequelize
```
