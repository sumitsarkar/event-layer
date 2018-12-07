module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: function () {
      return !!(window.fbq && typeof window.fbq === 'function');
    },
    track: function (eventName, eventProperties) {
      if (!window.fbq) return;

      fbq('trackCustom', eventName, eventProperties);
    },
    page: function (category, name, properties) {
      if (!window.fbq) return;

      fbq('track', "PageView");
    },
    facebookTrackEvent: function (eventName, eventProperties) {
      if (!window.fbq) return;

      fbq('track', eventName, eventProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}