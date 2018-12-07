const initializer = require('../../lib/initialize')

test('when initialize is called with user provided configuration', () => {
  const dummyConfig = {
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
      },
    },
  }

  const result = initializer(dummyConfig)
  expect(result.length).toEqual(1)
  expect(typeof result[0].transformers).toEqual('object')
  expect(result[0].transformers.eventTransformer()).toEqual({
    'eventName': 'goooooo',
    'eventProperties': {
      'khaaaaa': 'goooooo',
    },
  })
})

test('when initialize is called with unsupported configuration', () => {
  const dummyConfig = {
    'potato-analytics': {
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
      },
    },
  }

  try {
    const result = initializer(dummyConfig)
    // Hacky fail function. The code shouldn't reach here
    expect(true).toBe(false)
  } catch (e) {
    expect(e.message).toEqual(`Please check the configurations. We don't support: ${JSON.stringify(['potato-analytics'])}`)
  }
})