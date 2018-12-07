module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => window.olark,
    identify: (userId, userProperties) => {
      if (window.olark && userId) olark.identify(userId);

      if (userProperties.email) {
        olark('api.visitor.updateEmailAddress', {
          emailAddress: userProperties.email
        });
      }
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}