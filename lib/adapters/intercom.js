module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => (window.Intercom && window.Intercom('getVisitorId') && window.Intercom.booted) ? true : false,
    identify: (userId, userProperties) => {
      // Send the identify call to Intercom's JS library
      // console.log('Identifying: ', userId, userProperties);
      if (window.Intercom && userId)
        Intercom('update', { user_id: userId });

      // Set people properties on our identified user
      if (window.Intercom && userProperties)
        Intercom('update', userProperties);
    },
    track: (eventName, eventProperties) => {
      // Send the tracked event to Intercom's JS library
      // console.log('tracking: ', eventName, eventProperties);
      if (window.Intercom && eventName)
        Intercom('trackEvent', eventName, eventProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}