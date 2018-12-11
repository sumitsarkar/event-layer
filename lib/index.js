const initializer = require('./initialize')
const _cloneDeep = require('lodash/cloneDeep')

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

      for (let adapterName in adapters) {
        if (!adapters.hasOwnProperty(adapterName)) continue
        let adapter = adapters[adapterName].adapter
        let transformers = adapters[adapterName].transformers

        if (adapter.isEnabled() && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          if (adapter.identify && typeof (adapter.identify) === 'function') {
            // We are cloning the object to avoid any rogue libraries from modifying the object and causing problems for everybody else's reporting
            let identity = {
              userId: _cloneDeep(userId),
              userProperties: _cloneDeep(userProperties),
            }
            if (transformers.identityTransformer && typeof (transformers.identityTransformer) === 'function') {
              identity = transformers.identityTransformer(identity.userId, identity.userProperties)
            }
            adapter.identify(identity.userId, identity.userProperties)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback()
    },
    track: (eventName, eventProperties, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adapters) return // Early return if there are no adapters

      onReady()

      for (let adapterName in adapters) {
        if (!adapters.hasOwnProperty(adapterName)) continue
        let adapter = adapters[adapterName].adapter
        let transformers = adapters[adapterName].transformers

        if (adapter.isEnabled() && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          if (adapter.track && typeof (adapter.track) === 'function') {
            // We are cloning the object to avoid any rogue libraries from modifying the object and causing problems for everybody else's reporting
            let event = {
              eventName: _cloneDeep(eventName),
              eventProperties: _cloneDeep(eventProperties),
            }
            if (transformers.eventTransformer && typeof (transformers.eventTransformer) === 'function') {
              event = transformers.eventTransformer(event.eventName, event.eventProperties)
            }
            adapter.track(event.userId, event.userProperties)
          }
        }
      }

      if (callback && typeof (callback) === 'function') callback()
    },

    page: (category, name, properties, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adapters) return // Early return if there are no adapters

      onReady()

      // Handle not passing the category (shift right)
      if (category && (!name || typeof (name) !== 'string')) {
        callback = options
        options = properties
        properties = name
        name = category
        category = null
      }

      // url (canonical?), title, referrer, path
      let url = document.querySelector('link[rel=\'canonical\']') ? document.querySelector('link[rel=\'canonical\']').href : document.location.href
      let title = document.title
      let referrer = document.referrer
      let path = location.pathname

      let props = {
        url: url,
        title: title,
        referrer: referrer,
        path: path,
      }

      properties = Object.assign(props, properties)

      for (let adapterName in adapters) {
        if (!adapters.hasOwnProperty(adapterName)) continue
        let adapter = adapters[adapterName].adapter
        let transformers = adapters[adapterName].transformers

        if (adapter.isEnabled() && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          if (adapter.page && typeof (adapter.page) === 'function') {
            // We are cloning the object to avoid any rogue libraries from modifying the object and causing problems for everybody else's reporting
            let pageEvent = {
              category: _cloneDeep(category),
              name: _cloneDeep(name),
              properties: _cloneDeep(properties),
            }
            if (transformers.pageTransformer && typeof (transformers.pageTransformer) === 'function') {
              pageEvent = transformers.pageTransformer(pageEvent.category, pageEvent.name, pageEvent.properties)
            }
            adapter.track(pageEvent.category, pageEvent.name, pageEvent.properties)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback()
    },

    group: (groupId, traits, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adapters) return // Early return if there are no adapters

      onReady()

      for (let adapterName in adapters) {
        if (!adapters.hasOwnProperty(adapterName)) continue
        let adapter = adapters[adapterName].adapter
        let transformers = adapters[adapterName].transformers

        if (adapter.isEnabled() && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          if (adapter.group && typeof (adapter.group) === 'function') {
            // We are cloning the object to avoid any rogue libraries from modifying the object and causing problems for everybody else's reporting
            let groupEvent = {
              groupId: _cloneDeep(groupId),
              traits: _cloneDeep(traits),
            }
            if (transformers.groupTransformer && typeof (transformers.groupTransformer) === 'function') {
              groupEvent = transformers.groupTransformer(groupEvent.groupId, groupEvent.traits)
            }
            adapter.track(groupEvent.groupId, groupEvent.traits)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback()
    },

    alias: (userId, previousId, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adapters) return // Early return if there are no adapters

      onReady()

      for (let adapterName in adapters) {
        if (!adapters.hasOwnProperty(adapterName)) continue
        let adapter = adapters[adapterName].adapter
        let transformers = adapters[adapterName].transformers

        if (adapter.isEnabled() && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          if (adapter.alias && typeof (adapter.alias) === 'function') {
            // We are cloning the object to avoid any rogue libraries from modifying the object and causing problems for everybody else's reporting
            let aliasEvent = {
              userId: _cloneDeep(userId),
              previousId: _cloneDeep(previousId),
            }
            if (transformers.aliasTransformer && typeof (transformers.aliasTransformer) === 'function') {
              aliasEvent = transformers.aliasTransformer(aliasEvent.userId, aliasEvent.previousId)
            }
            adapter.track(aliasEvent.userId, aliasEvent.previousId)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback()
    },

    /**
     * Facebook tracking pixel support. This should only be used if Facebook Events are being tracked.
     *
     * Based on: https://developers.facebook.com/docs/facebook-pixel/api-reference
     *
     * Facebook tracking pixel specific event names:
     * ViewContent
     * Search
     * AddToCart
     * AddToWishlist
     * InitiateCheckout
     * AddPaymentInfo
     * Purchase
     * Lead
     * CompleteRegistration
     */
    fbTrack: (eventName, eventProperties, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adapters) return // Early return if there are no adapters

      onReady()

      for (let adapterName in adapters) {
        if (!adapters.hasOwnProperty(adapterName)) continue
        let adapter = adapters[adapterName].adapter
        let transformers = adapters[adapterName].transformers

        if (adapter.isEnabled() && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          if (adapter.facebookTrackEvent && typeof (adapter.facebookTrackEvent) === 'function') {
            // We are cloning the object to avoid any rogue libraries from modifying the object and causing problems for everybody else's reporting
            let fbEvent = {
              eventName: _cloneDeep(eventName),
              eventProperties: _cloneDeep(eventProperties),
            }
            if (transformers.fbTransformer && typeof (transformers.fbTransformer) === 'function') {
              fbEvent = transformers.fbTransformer(fbEvent.userId, fbEvent.previousId)
            }
            adapter.facebookTrackEvent(fbEvent.userId, fbEvent.previousId)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback()
    }
  }
}

// Recursively convert an `obj`'s dates to new values, using an input function, convert().
function convertDates (oObj, convert) {
  if (typeof (oObj) !== 'object') return oObj

  let obj = Object.assign({}, oObj)

  for (let key in obj) {
    let val = obj[key]
    if (typeof (val) === 'date') obj[key] = convert(val)
    if (typeof (val) === 'object') obj[key] = convertDates(val, convert)
  }

  return obj
}


module.exports = EventLayerFactory()