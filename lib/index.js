const adapters = require('./adapters')
const initializer = require('./initialize')
const lodash = require('lodash')

const EventLayerFactory = () => {
  let adapters
  let initialized = false
  let readyFunction

  let onReady = () => {
    if (!readyFunction) return
    if (readyFunction && typeof (readyFunction) === 'function') readyFunction()
    readyFunction = null
  }

  return {
    initialize: (config) => {
      try {
        adapters = initializer(config)
        initialized = true
      } catch (e) {
        throw e
      }
    },
    ready: (callback) => {
      if (callback && typeof (callback) === 'function')
        readyFunction = callback
    },
    identify: (userId, userProperties, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adapters) return // Early return if there are no adapters

      onReady()

      _.forIn(adapters, (value, key) => {
        let adapter = value.adapter
        let transformers = value.transformers

        if (adapter.isEnabled() && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          if (adapter.identify && typeof (adapter.identify) === 'function') {
            // We are cloning the object to avoid any rogue libraries from modifying the object and causing problems for everybody else's reporting
            let identity = {
              userId: _.cloneDeep(userId),
              userProperties: _.cloneDeep(userProperties),
            }
            if (transformers.identityTransformer && typeof (transformers.identityTransformer) === 'function') {
              identity = transformers.identityTransformer(userId, userProperties)
            }
            adapter.identify(identity.userId, identity.userProperties)
          }
        }
      })
      if (callback && typeof (callback) === 'function') callback()
    },
    track: (eventName, eventProperties, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adapters) return // Early return if there are no adapters

      onReady()

      _.forIn(adapters, (value, key) => {
        let adapter = value.adapter
        let transformers = value.transformers

        if (adapter.isEnabled() && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          if (adapter.track && typeof (adapter.track) === 'function') {
            // We are cloning the object to avoid any rogue libraries from modifying the object and causing problems for everybody else's reporting
            let event = {
              eventName: _.cloneDeep(eventName),
              eventProperties: _.cloneDeep(eventProperties),
            }
            if (transformers.eventTransformer && typeof (transformers.eventTransformer) === 'function') {
              event = transformers.eventTransformer(eventName, eventProperties)
            }
            adapter.track(event.userId, event.userProperties)
          }
        }
      })

      if (callback && typeof (callback) === 'function') callback()
    },

    page: (category, name, properties, options, callback) => {

    }
  }
}

// Recursively convert an `obj`'s dates to new values, using an input function, convert().
function convertDates (oObj, convert) {
  if (typeof (oObj) !== 'object') return oObj

  var obj = Object.assign({}, oObj)

  for (var key in obj) {
    var val = obj[key]
    if (typeof (val) === 'date') obj[key] = convert(val)
    if (typeof (val) === 'object') obj[key] = convertDates(val, convert)
  }

  return obj
}