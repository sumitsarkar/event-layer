module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => window.mixpanel && window.mixpanel.__loaded,
    identify: (userId, userProperties, options) => {
      // Send the identify call to Mixpanel's JS library
      // console.log('Identifying: ', userId, userProperties);
      if (window.mixpanel && userId) mixpanel.identify(userId);

      if (window.mixpanel && userProperties) {
        if (options && options.setOnce) {
          // Set people properties on our identified user, but only if they have not yet been set.
          mixpanel.people.set_once(userProperties);
        } else {
          // Set people properties on our identified user
          mixpanel.people.set(userProperties);
        }
      }
    },
    track: (eventName, eventProperties) => {
      // Send the tracked event to Mixpanel's JS library
      // console.log('tracking: ', eventName, eventProperties);
      if (window.mixpanel && eventName) mixpanel.track(eventName, eventProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}