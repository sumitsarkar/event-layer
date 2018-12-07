module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    test: () => window.analytics && typeof (window.analytics) === 'object' && window.analytics.Integrations && typeof (window.analytics.Integrations) === 'object',
    identify: (userId, userProperties) => {
      // Send the identify call to Segment's Analytics.js library
      // console.log('Identifying: ', userId, userProperties);
      if (window.analytics && userId) analytics.identify(userId, userProperties)
    },
    track: (eventName, eventProperties) => {
      // Send the tracked event to Segment's Analytics.js library
      // console.log('tracking: ', eventName, eventProperties);
      if (window.analytics && eventName) analytics.track(eventName, eventProperties)
    },
    page: (category, name, properties) => {
      // Send the page call to Segment's Analytics.js library
      // console.log('page: ', category, name, properties);
      if (window.analytics && name) analytics.page(category, name, properties)
    },
    alias: (userId, previousId) => {
      // Send the alias call to Segment's Analytics.js library
      // console.log('alias: ', userId, previousId);
      if (window.analytics && userId && previousId) analytics.alias(userId, previousId)
    },
    group: (groupId, traits) => {
      // Send the group call to Segment's Analytics.js library
      // console.log('group: ', groupId, traits);
      if (window.analytics && groupId) analytics.group(groupId, traits)
    },
    isEnabled: () => enabled,
  }
}