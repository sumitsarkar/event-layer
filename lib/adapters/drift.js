module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: function () {
      return window.drift !== undefined;
    },
    track: function (eventName, eventProperties) {
      // Todo: Nice to have, Investigate convertDates for eventProperties.
      // This seems to iterate through dates and apply `Math.floor(date.getTime() / 1000)`

      if (window.drift && eventName)
        window.drift.track(eventName, eventProperties);
    },
    identify: function (userId, userProperties) {
      if (!window.drift || !userId) return;

      delete userProperties.id;
      window.drift.identify(userId, userProperties);
    },
    page: function (category, name, properties) {
      if (window.drift && name)
        window.drift.page(name);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}