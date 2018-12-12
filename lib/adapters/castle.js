module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled: false

  return {
    test: function () {
      return typeof window._castle === 'function'
    },
    identify: function (userId, userProperties) {
      delete userProperties.id
      if (window._castle) _castle('identify', userId, userProperties)
    },
    track: function (eventName, eventProperties) {
      if (window._castle) _castle('track', eventName, eventProperties)
    },
    page: function (category, name, properties) {
      if (window._castle) _castle('page', properties.url, properties.title)
    },

    isEnabled: () => enabled,
  }
}