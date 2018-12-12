module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled: false

  return {
    test: () => (window.amplitude && window.amplitude.options) ? true : false,
    identify: (userId, userProperties) => {
      // Send the identify call to Amplitude's JS library
      // console.log('Identifying: ', userId, userProperties);
      if (window.amplitude && userId) amplitude.getInstance().setUserId(userId)

      // Set people properties on our identified user
      if (window.amplitude && userProperties) amplitude.getInstance().setUserProperties(userProperties)
    },
    track: (eventName, eventProperties) => {
      // Send the tracked event to Amplitude's JS library
      // console.log('tracking: ', eventName, eventProperties);
      if (window.amplitude && eventName) amplitude.getInstance().logEvent(eventName, eventProperties)
    },
    page: (category, name, properties) => {
      if (window.amplitude) {
        if (category || name) {
          if (category)
            amplitude.getInstance().logEvent('pageview_' + category, properties)

          if (name)
            amplitude.getInstance().logEvent('pageview_' + name, properties)
        } else {
          amplitude.getInstance().logEvent('pageview', properties)
        }
      }
    },

    isEnabled: () => enabled,
  }
}