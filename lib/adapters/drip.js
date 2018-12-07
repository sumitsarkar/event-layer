module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    test: () => window._dc && typeof (window._dc) === 'object',
    track: (eventName, eventProperties) => {
      if (!window._dcq || !eventName) return

      if (eventProperties) {
        // Convert all keys with spaces to underscores
        for (var key in eventProperties) {
          if (key.indexOf(' ') === -1) return // Skip keys w/o spaces

          var formattedKey = key.replace(' ', '_')
          eventProperties[formattedKey] = eventProperties[key]
          delete eventProperties[key]
        }

        if (eventProperties.revenue) {
          var cents = Math.round(eventProperties.revenue * 100)
          eventProperties.cents = cents
          delete eventProperties.revenue
        }
      }

      window._dcq.push('track', eventName, eventProperties)
    },
    identify: (userId, userProperties) => {
      if (window._dcq && userProperties)
        window._dcq.push('identify', userProperties)
    },

    isEnabled: () => enabled,
  }
}