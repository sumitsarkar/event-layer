module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    // Todo: This test sucks (keen is not opinionated as to what global you place it in (you don't even need to expose it as a global),
    // but defaults to client, which is too common to use as a test.)
    test: () => ((window.Keen && window.Keen.loaded) || ((window.KeenAsync && window.KeenAsync.loaded))) && window.client,
    identify: (userId, userProperties) => {
      try {
        if (window.client && userId) client.extendEvents({
          'user_id': userId,
        })

        if (window.client && userProperties) client.extendEvents(userProperties)
      } catch (e) {
        console.log(e)
      }
    },
    track: (eventName, eventProperties) => {
      if (window.client && eventName) client.recordEvent(eventName, eventProperties)
    },

    isEnabled: () => enabled,
  }
}