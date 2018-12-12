const adapters = require('./adapters')

module.exports.initialize = (config) => {
  const allowedConfigurations = Object.keys(adapters)
  const incomingConfigurationKeys = Object.keys(config)

  const difference = arrayDifference(incomingConfigurationKeys, allowedConfigurations)

  if (difference.length > 0) {
    throw new Error(`Please check the configurations. We don't support: ${JSON.stringify(difference)}`)
  }

  const enabledAdapters = {}

  for (let i = 0; i < incomingConfigurationKeys.length; i++) {
    let key = incomingConfigurationKeys[i]
    console.log(key)
    const adapter = adapters[key]
    console.log(adapter)
    // Initialize adapter
    enabledAdapters[key] = {
      transformers: config[key].transformers,
      adapter: adapter(config[key])
    }
  }

  return enabledAdapters
}

const arrayDifference = (array1, array2) => {
  return array1.filter(function (item) {
    return array2.indexOf(item) < 0
  })
}