module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: function () {
      return typeof window._castle === 'function';
    },
    identify: function (userId, userProperties) {
      delete userProperties.id;
      if (window._castle) _castle('identify', userId, userProperties);
    },
    track: function (eventName, eventProperties) {
      if (window._castle) _castle('track', eventName, eventProperties);
    },
    page: function (category, name, properties) {
      if (window._castle) _castle('page', properties.url, properties.title);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}