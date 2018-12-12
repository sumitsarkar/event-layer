module.exports = (options) => {
  const enabled = (typeof options.enabled === 'boolean') ? options.enabled: false

  return {
    test: () => window.FS && window._fs_loaded,
    identify: (userId, userProperties) => {
      if (window.FS && userId) FS.identify(userId, userProperties)
    },

    isEnabled: () => enabled,
  }
}