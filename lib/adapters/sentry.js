module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => window.Raven,
    identify: (userId, userProperties) => {
      if (!userProperties) userProperties = {};
      if (userId) userProperties.userId = userId;

      if (window.Raven)
        Raven.setUserContext(userProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}