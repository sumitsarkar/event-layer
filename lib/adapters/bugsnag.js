module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: function () {
      return window.Bugsnag && typeof(window.Bugsnag) === 'object';
    },
    identify: function (userId, userProperties) {
      if (!window.Bugsnag) return;
      window.Bugsnag.user = window.Bugsnag.user || {};
      window.Bugsnag.user = Object.assign(window.Bugsnag.user, userProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}