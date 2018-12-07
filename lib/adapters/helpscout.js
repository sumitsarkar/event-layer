module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    test: () => window.HS && window.HSCW,
    identify: (userId, userProperties) => {

      if (userId) {
        if (!userProperties) userProperties = {}
        userProperties.userId = userId
      }

      if (window.HS && userProperties)
        HS.beacon.identify(userProperties)
    },

    isEnabled: () => enabled,
  }
}