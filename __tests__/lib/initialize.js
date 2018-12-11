const initializer = require('../../lib/initialize')
const _ = require('lodash')
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
        pageTransformer: (category, name, properties) => {
          return {
            'category': 'potato',
            'name': 'namewa',
            'properties': {}
          }
  }
      },
    },
  }

  const result = initializer(dummyConfig)
  expect(_.keys(result).length).toEqual(1)
  expect(typeof result['google-analytics'].transformers).toEqual('object')
  expect(result['google-analytics'].transformers.eventTransformer()).toEqual({
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