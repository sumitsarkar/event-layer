module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    test: () => !!(window._cio && window._cio.push !== Array.prototype.push),
    track: (eventName, eventProperties) => {
      if (!window._cio) return

      window._cio.track(eventName, eventProperties)
    },
    identify: (userId, userProperties) => {
      if (!window._cio) return
      if (!userId) return console.warn('user id required by customer.io for identify function.')

      // Expects userProperties { id: string unique, email: string, created_at: unix-timestamp }

      // Transform createdAt -> created_at
      if (userProperties && userProperties.createdAt && !userProperties.created_at)
        userProperties.created_at = userProperties.createdAt

      // Add userId if no id is present
      if (userProperties && !userProperties.id)
        userProperties.id = userId

      window._cio.identify(userProperties)
    },
    alias: (userId, previousId) => {
      // Todo
    },
    group: (groupId, traits) => {
      // Todo
    },
    page: (category, name, properties) => {
      if (!window._cio) return

      if (!window.__currentUserId) return console.warn('You must call the Identify function for Customer.io before the page function, passing a valid userId.')
      if (!name) return console.warn('Customer.io requires a valid name property when calling the page event. Since Analytics.js expects a category field as well, this must be sent (even if it is empty). See documentation for more details.')

      if (!properties) properties = {}

      properties.id = window.__currentUserId
      properties.type = 'page'
      properties.name = name
      properties.category = category

      window._cio.page(location.href, properties)
    },

    isEnabled: () => enabled,
  }
}