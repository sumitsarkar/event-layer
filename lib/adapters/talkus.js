module.exports = (options) => {
  const enabled = options.enabled;
  const transformer = options.transformer

  return {
    test: function () {
      return !!window.talkus;
    },
    identify: function (userId, userProperties) {
      // Hacky way of getting the AppId (for now Todo update)
      var lsObj = JSON.parse(localStorage.getItem('talkusBubbleTS'));
      var appId = Object.keys(lsObj)[0];

      if (!userProperties) userProperties = {};
      userProperties.userId = userId;

      if (window.talkus && appId) talkus('init', appId, userProperties);
    },
    getTransformer: () => transformer,
    isEnabled: () => enabled
  }
}