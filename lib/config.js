module.exports = {
  'google-analytics': {
    enabled: true,
    transformers: {
      eventTransformer: (eventName, eventProperties) => {
        return {
          'eventName': 'goooooo',
          'eventProperties': {
            'khaaaaa': 'goooooo',
          },
        }
      },
      identityTransformer: (userId, userProperties) => {
        return {
          'userId': 'lakhanwa',
          'userProperties': {},
        }
      },
      pageTransformer: (category, name, properties) => {

      },
    },
  },
}
