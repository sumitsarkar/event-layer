module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled: false

  return {
    test: () => !!(window.improvely && window.improvely.identify),
    track: (eventName, eventProperties) => {
      var props = eventProperties

      // Todo: What does track.properties({ revenue: 'amount' }) do?
      // Does it do this?
      // props = Object.assign(props, { revenue: 'amount' });
      // or this?
      // props.revenue = props.amount;
      props.revenue = props.amount
      delete props.amount

      props.type = eventName
      window.improvely.goal(props)
    },
    identify: (userId, userProperties) => {
      if (userId && window.improvely)
        window.improvely.label(userId)
    },

    isEnabled: () => enabled,
  }
}