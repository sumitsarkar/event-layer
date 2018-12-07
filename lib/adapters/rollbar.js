module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    test: () => window.Rollbar,
    identify: (userId, userProperties) => {
      if (!userProperties) userProperties = {}
      userProperties.id = userId

      if (window.Rollbar && userId)
        Rollbar.configure({ payload: { person: userProperties } })
    },

    isEnabled: () => enabled,
  }
}