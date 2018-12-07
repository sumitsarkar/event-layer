module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => window.HS && window.HSCW,
    identify: (userId, userProperties) => {

      if (userId) {
        if (!userProperties) userProperties = {};
        userProperties.userId = userId;
      }

      if (window.HS && userProperties)
        HS.beacon.identify(userProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}