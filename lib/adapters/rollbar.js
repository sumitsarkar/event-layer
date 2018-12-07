module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => window.Rollbar,
    identify: (userId, userProperties) => {
      if (!userProperties) userProperties = {};
      userProperties.id = userId;

      if (window.Rollbar && userId)
        Rollbar.configure({ payload: { person: userProperties } });
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}