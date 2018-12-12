module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled: false

  return {
    test: function () {
      return window.Bugsnag && typeof (window.Bugsnag) === 'object'
    },
    identify: function (userId, userProperties) {
      if (!window.Bugsnag) return
      window.Bugsnag.user = window.Bugsnag.user || {}
      window.Bugsnag.user = Object.assign(window.Bugsnag.user, userProperties)
    },

    isEnabled: () => enabled,
  }
}