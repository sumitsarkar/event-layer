module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    test: () => !!window.chmln,
    track: (eventName, eventProperties) => {
      if (window.chmln && eventName) chmln.track(eventName, eventProperties)
    },
    identify: (userId, userProperties) => {
      if (window.chmln && userId) {
        var obj = { uid: userId }

        if (userProperties.email) obj.email = userProperties.email
        if (userProperties.created) obj.created = userProperties.created
        if (userProperties.createdAt) obj.created = userProperties.createdAt

        if (userProperties.city) obj.city = userProperties.city
        if (userProperties.state) obj.state = userProperties.state
        if (userProperties.country) obj.country = userProperties.country

        // platform, device, screen, browser, IP address, locale, timezone, language

        chmln.identify(obj)
      }
    },
    alias: (userId, previousId) => {
      if (window.chmln && userId && previousId) chmln.alias({ from: previousId, to: userId })
    },
    group: (groupId, traits) => {
      if (!groupId) return
      var options = {}

      if (traits) {
        for (var key in traits) {
          options['group:' + key] = traits[key]
        }
      }

      options['group:id'] = groupId
      window.chmln.set(options)
    },

    isEnabled: () => enabled,
  }
}