module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled : false

  if (window.abc) {
    abc.initialize(options.config)
  }

  return {
    test: () => window.abc && typeof (window.abc) === 'object',
    identify: (userId, userProperties) => {
      // Send the identify call to ABC's library
      // console.log('Identifying: ', userId, userProperties);
      if (window.abc && userId) abc.identify(userId, userProperties)
    },
    track: (eventName, eventProperties) => {
      // Send the tracked event to ABC's library
      // console.log('tracking: ', eventName, eventProperties);
      if (window.abc && eventName) abc.track(eventName, eventProperties)
    },
    page: (category, name, properties) => {
      // Send the page call to ABC's library
      // console.log('page: ', category, name, properties);
      if (window.abc && name) abc.page(category, name, properties)
    },
    isEnabled: () => enabled,
  }
}