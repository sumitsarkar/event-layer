const Initializer = require('./initialize')
const _cloneDeep = require('lodash/cloneDeep')
const Page = require('./page')

const EventLayerFactory = () => {
  let adapters
  let initialized = false
  let readyFunction

  let onReady = () => {
    if (!readyFunction) return
    if (readyFunction && typeof (readyFunction) === 'function') readyFunction('ready')
    readyFunction = null
  }

  let adaptersAvailable = () => {
    return Object.keys(adapters).length > 0
  }

  return {
    initialize: (config) => {
      try {
        adapters = Initializer.initialize(config)
        initialized = true
      } catch (e) {
        throw e
      }
    },
    isInitialized: () => initialized,
    ready: (callback) => {
      if (callback && typeof (callback) === 'function')
        readyFunction = callback
    },
    identify: (userId, userProperties, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adaptersAvailable()) return // Early return if there are no adapters

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
            if (transformers && transformers.identityTransformer && typeof (transformers.identityTransformer) === 'function') {
              identity = transformers.identityTransformer(identity.userId, identity.userProperties)
            }
            adapter.identify(identity.userId, identity.userProperties)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback('done')
    },
    track: (eventName, eventProperties, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adaptersAvailable()) return // Early return if there are no adapters

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
            if (transformers && transformers.eventTransformer && typeof (transformers.eventTransformer) === 'function') {
              event = transformers.eventTransformer(event.eventName, event.eventProperties)
            }
            adapter.track(event.eventName, event.eventProperties)
          }
        }
      }

      if (callback && typeof (callback) === 'function') callback('done')
    },
    page: (category, name, properties, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adaptersAvailable()) return // Early return if there are no adapters

      onReady()

      // Handle not passing the category (shift right)
      if (category && (!name || typeof (name) !== 'string')) {
        callback = options
        options = properties
        properties = name
        name = category
        category = null
      }

      let props = Page.getPageProps()

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
            if (transformers && transformers.pageTransformer && typeof (transformers.pageTransformer) === 'function') {
              pageEvent = transformers.pageTransformer(pageEvent.category, pageEvent.name, pageEvent.properties)
            }
            adapter.page(pageEvent.category, pageEvent.name, pageEvent.properties)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback('done')
    },
    group: (groupId, traits, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adaptersAvailable()) return // Early return if there are no adapters

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
            if (transformers && transformers.groupTransformer && typeof (transformers.groupTransformer) === 'function') {
              groupEvent = transformers.groupTransformer(groupEvent.groupId, groupEvent.traits)
            }
            adapter.group(groupEvent.groupId, groupEvent.traits)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback('done')
    },
    alias: (userId, previousId, options, callback) => {
      if (!initialized) throw Error('Event Layer has not been initialized yet!')
      if (!adaptersAvailable()) return // Early return if there are no adapters

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
            if (transformers && transformers.aliasTransformer && typeof (transformers.aliasTransformer) === 'function') {
              aliasEvent = transformers.aliasTransformer(aliasEvent.userId, aliasEvent.previousId)
            }
            adapter.alias(aliasEvent.userId, aliasEvent.previousId)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback('done')
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
      if (!adaptersAvailable()) return // Early return if there are no adapters

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
            if (transformers && transformers.fbTransformer && typeof (transformers.fbTransformer) === 'function') {
              fbEvent = transformers.fbTransformer(fbEvent.eventName, fbEvent.eventProperties)
            }
            adapter.facebookTrackEvent(fbEvent.eventName, fbEvent.eventProperties)
          }
        }
      }
      if (callback && typeof (callback) === 'function') callback('done')
    },
  }
}

module.exports.EventLayerFactory = EventLayerFactory
module.exports.EventLayer = EventLayerFactory()