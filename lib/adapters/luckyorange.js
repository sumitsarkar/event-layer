module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => !!window.__lo_cs_added,
    identify: (userId, userProperties) => {
      if (!userProperties) userProperties = {};
      if (userId) userProperties.userId = userId;

      if (window.__lo_cs_added)
        window.__wtw_custom_user_data = userProperties;
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}