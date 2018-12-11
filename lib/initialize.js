const _ = require('lodash')
const adapters = require('./adapters')

module.exports = (config) => {
  const allowedConfigurations = _.keys(adapters)
  const incomingConfigurationKeys = _.keys(config)

  const difference = _.difference(incomingConfigurationKeys, allowedConfigurations)

  if (difference.length > 0) {
    throw new Error(`Please check the configurations. We don't support: ${JSON.stringify(difference)}`)
  }

  const enabledAdapters = {}

  _.forEach(incomingConfigurationKeys, (key) => {
    const adapter = adapters[key]
    console.log(adapter)
    // Initialize adapter
    enabledAdapters[key] = {
      transformers: config[key].transformers,
      adapter: adapter(config[key])
    }
  })

  return enabledAdapters
}