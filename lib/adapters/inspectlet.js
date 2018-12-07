module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    test: () => !!(window.__insp_ && window.__insp),
    track: (eventName, eventProperties) => {
      if (window.__insp && eventName)
        __insp.push('tagSession', eventName, eventProperties)
    },
    identify: (userId, userProperties) => {
      if (!window.__insp) return

      //var traits = identify.traits({ id: 'userid' });
      // Todo: Am I doing it right?
      var traits = Object.assign({}, userProperties)
      traits.id = userId || traits.uid
      delete traits.uid

      if (userProperties && userProperties.email)
        __insp.push('identify', userProperties.email)

      if (userId || userProperties)
        __insp.push('tagSession', traits)
    },
    page: (category, name, properties) => {
      if (window.__insp)
        __insp.push('virtualPage')
    },

    isEnabled: () => enabled,
  }
}