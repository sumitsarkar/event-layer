module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled: false

  return {
    test: () => window.olark,
    identify: (userId, userProperties) => {
      if (window.olark && userId) olark.identify(userId)

      if (userProperties.email) {
        olark('api.visitor.updateEmailAddress', {
          emailAddress: userProperties.email,
        })
      }
    },

    isEnabled: () => enabled,
  }
}