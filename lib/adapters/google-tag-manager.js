module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => !!(window.dataLayer && Array.prototype.push !== window.dataLayer.push),
    track: (eventName, eventProperties) => {
      if (!eventProperties) eventProperties = {};
      eventProperties.event = eventName;

      if (window.dataLayer && eventProperties) dataLayer.push(eventProperties);
    },
    page: (category, name, properties) => {
      if (!properties) properties = {};
      properties.event = 'pageview_' + name;
      properties.category = category;

      if (window.dataLayer)
        dataLayer.push(properties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}