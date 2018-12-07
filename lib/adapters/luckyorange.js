module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? false : options.enabled

  return {
    test: () => !!window.__lo_cs_added,
    identify: (userId, userProperties) => {
      if (!userProperties) userProperties = {}
      if (userId) userProperties.userId = userId

      if (window.__lo_cs_added)
        window.__wtw_custom_user_data = userProperties
    },

    isEnabled: () => enabled,
  }
}