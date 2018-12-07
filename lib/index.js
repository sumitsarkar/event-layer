const adapters = require('./adapters')

module.exports = () => {

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

function track (eventName, eventProperties, options, callback) {
  if (!thirdPartyAdapters) return // Early return if there are no adapters

  onReady()

  for (var adapterName in thirdPartyAdapters) {
    var adapter = thirdPartyAdapters[adapterName]

    // If this adapter passes it's own internal test (usually to detect if a specific source is available)
    if (adapter.enabled && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
      // If everything checks out for the data we've received,
      // pass the data to the adapter so it can be tracked

      // If TRANSLATE_EVENT_NAMES exists, use it to translate event names
      if (window.TRANSLATE_EVENT_NAMES && typeof window.TRANSLATE_EVENT_NAMES === 'object')
        eventName = TRANSLATE_EVENT_NAMES(eventName)

      if (adapter.track && typeof (adapter.track) === 'function')
        adapter.track(eventName, eventProperties)
    }
  }

  if (callback && typeof (callback) === 'function') callback()
}

function page (category, name, properties, options, callback) {
  if (!thirdPartyAdapters) return // Early return if there are no adapters

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
  var url = document.querySelector('link[rel=\'canonical\']') ? document.querySelector('link[rel=\'canonical\']').href : document.location.href
  var title = document.title
  var referrer = document.referrer
  var path = location.pathname

  var props = {
    url: url,
    title: title,
    referrer: referrer,
    path: path,
  }

  var properties = Object.assign(props, properties)

  for (var adapterName in thirdPartyAdapters) {
    var adapter = thirdPartyAdapters[adapterName]

    // If this adapter passes it's own internal test (usually to detect if a specific source is available)
    if (adapter.enabled && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
      // If everything checks out for the data we've received,
      // pass the data to the adapter so it can be tracked
      if (adapter.page && typeof (adapter.page) === 'function')
        adapter.page(category, name, properties)
    }
  }

  if (callback && typeof (callback) === 'function') callback()
}

function group (groupId, traits, options, callback) {
  if (!thirdPartyAdapters) return // Early return if there are no adapters

  onReady()

  for (var adapterName in thirdPartyAdapters) {
    var adapter = thirdPartyAdapters[adapterName]

    // If this adapter passes it's own internal test (usually to detect if a specific source is available)
    if (adapter.enabled && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
      // If everything checks out for the data we've received,
      // pass the data to the adapter so we can perform a grouping
      if (adapter.group && typeof (adapter.group) === 'function')
        adapter.group(groupId, traits)
    }
  }

  if (callback && typeof (callback) === 'function') callback()
}

function alias (userId, previousId, options, callback) {
  if (!thirdPartyAdapters) return // Early return if there are no adapters

  onReady()

  for (var adapterName in thirdPartyAdapters) {
    var adapter = thirdPartyAdapters[adapterName]

    // If this adapter passes it's own internal test (usually to detect if a specific source is available)
    if (adapter.enabled && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
      // If everything checks out for the data we've received,
      // pass the data to the adapter so we can alias this user
      if (adapter.alias && typeof (adapter.alias) === 'function')
        adapter.alias(userId, previousId)
    }
  }

  if (callback && typeof (callback) === 'function') callback()
}

/**
 * Facebook tracking pixel support
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
function fbTrack (eventName, eventProperties, options, callback) {
  if (!thirdPartyAdapters) return // Early return if there are no adapters

  onReady()

  // Iterate through third-party adapters, sending track events.
  for (var adapterName in thirdPartyAdapters) {
    var adapter = thirdPartyAdapters[adapterName]

    if (adapterName === 'facebook-tracking-pixel') continue // Skip FB Tracking pixel

    // If this adapter passes it's own internal test (usually to detect if a specific source is available)
    if (adapter.enabled && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
      // If everything checks out for the data we've received,
      // pass the data to the adapter so it can be tracked
      if (adapter.facebookTrackEvent && typeof (adapter.facebookTrackEvent) === 'function') {
        adapter.facebookTrackEvent(eventName, eventProperties)
      } else if (adapter.track && typeof (adapter.track) === 'function') {
        // If TRANSLATE_EVENT_NAMES exists, use it to translate event names
        if (window.TRANSLATE_EVENT_NAMES && typeof window.TRANSLATE_EVENT_NAMES === 'object')
          eventName = TRANSLATE_EVENT_NAMES(eventName)

        adapter.track(eventName, eventProperties)
      }

    }
  }

  if (callback && typeof (callback) === 'function') callback()
}

// Execute directly before the first track/identify/page/group/alias call, or after a default timeout (5s)
setTimeout(onReady, 5000)

const EventLayer = () => {
  let readyFunction
  return {
    initialize: (config) => {

    },
    readyFunction: null,
    Integrations: null,
    identify: (userId, userProperties, options, callback) => {
      if (!thirdPartyAdapters) return // Early return if there are no adapters

      onReady()

      // Stash this for later
      window.__currentUserId = userId

      for (var adapterName in thirdPartyAdapters) {
        var adapter = thirdPartyAdapters[adapterName]

        // If this adapter passes it's own internal test (usually to detect if a specific source is available)
        if (adapter.enabled && adapter.test && typeof (adapter.test) === 'function' && adapter.test()) {
          // If everything checks out for the data we've received,
          // pass the data to the adapter so it can be tracked
          if (adapter.identify && typeof (adapter.identify) === 'function')
            adapter.identify(userId, userProperties)
        }
      }

      if (callback && typeof (callback) === 'function') callback()
    },
    ready: (callback) => {
      if (callback && typeof (callback) === 'function')
        readyFunction = callback
    },
    onReady: () => {
      if (!readyFunction) return
      if (readyFunction && typeof (readyFunction) === 'function') readyFunction()
      readyFunction = null
    },
    fbTrack: fbTrack,
    group: group,
    alias: alias,
    page: page
  }
}