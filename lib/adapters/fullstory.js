module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: () => window.FS && window._fs_loaded,
    identify: (userId, userProperties) => {
      if (window.FS && userId) FS.identify(userId, userProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}