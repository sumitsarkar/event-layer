module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled: false

  return {
    test: () => !!window._elev,
    identify: (userId, userProperties) => {
      if (!userProperties || !window._elev) return

      var user = {}
      user.via = 'event-layer'

      if (userProperties.email) user.email = userProperties.email
      if (userProperties.name) user.name = userProperties.name
      if (userProperties.plan) user.plan = [userProperties.plan]
      if (userProperties.plan) user.groups = [userProperties.plan]

      // Delete those
      delete userProperties.firstName
      delete userProperties.lastName
      delete userProperties.email
      delete userProperties.name
      delete userProperties.plan
      delete userProperties.id

      if (Object.keys(userProperties).length > 0) user.traits = userProperties
      window._elev.user = user
    },

    isEnabled: () => enabled,
  }
}