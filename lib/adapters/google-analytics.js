module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => window.ga,
    identify: (userId, userProperties = {}) => {
      if (window.ga) {
        userProperties.userId = userId
        ga('set', userProperties);
      }
    },
    track: (eventName, eventProperties = {}) => {
      if (window.ga) {
        if (!eventProperties.hasOwnProperty("eventCategory")) {
          eventProperties.eventCategory = "All"
        }
        eventProperties.eventAction = eventName;
        eventProperties.hitType = 'event'
        ga('send', eventProperties);
      }
    },
    page: (category, name, properties = {}) => {
      if (window.ga) {
        if (category) properties.category = category;
        properties.hitType = 'pageview';
        properties.page = name || properties.path;
        properties.location = properties.url;
        ga('send', properties);
      }
    },
    page: (category, name, properties) => {
      if (window.ga) {
        var tracker;

        try {
          tracker = ga.getAll()[0];
        } catch(e){}

        // See: https://developers.google.com/analytics/devguides/collection/analyticsjs/pages

        if (category) properties.category = category;
        properties.hitType = 'pageview';
        properties.page = name || properties.path;
        properties.location = properties.url;

        if (tracker) {
          tracker.set(properties);
          tracker.send(properties);
        } else {
          ga('set', properties);
          ga('send', properties);
        }

        // Default (Simpler) approach used by GA default code snippet:
        // ga('send', 'pageview');
      }
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}