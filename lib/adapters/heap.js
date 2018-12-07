module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => !!(window.heap && window.heap.track),
    identify: (userId, userProperties) => {
      // Send the identify call to Heap's JS library
      // console.log('Identifying: ', userId, userProperties);
      if (window.heap && userId) heap.identify(userId);

      // Set people properties on our identified user
      if (window.heap && userProperties) heap.addUserProperties(userProperties);
    },
    track: (eventName, eventProperties) => {
      // Send the tracked event to Heap's JS library
      // console.log('tracking: ', eventName, eventProperties);
      if (window.heap && eventName) heap.track(eventName, eventProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}