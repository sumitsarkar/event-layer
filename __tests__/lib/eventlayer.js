const EventLayerFactory = require('../../lib/index').EventLayerFactory
const Initializer = require('../../lib/initialize')
const Page = require('../../lib/page')
const _ = require('lodash')

const dummyConfig = {
  'potato': {
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
          'properties': {},
        }
      },
    },
  },
}

const mockAdapters = {
  'potato': (enabled) => {
    return {
      test: () => true,
      identify: (userId, userProperties) => {},
      track: (eventName, eventProperties) => {},
      page: (category, name, properties) => {},
      alias: (userId, previousId) => {},
      group: (groupId, traits) => {},
      facebookTrackEvent: (eventName, eventProperties, options, callback) => {},
      isEnabled: () => enabled,
    }
  },
  'tomato': (enabled) => {
    return {
      test: () => true,
      identify: (userId, userProperties) => {},
      isEnabled: () => enabled,
    }
  },
  'banana': (enabled) => {
    return {
      test: () => true,
      track: (eventName, eventProperties) => {},
      isEnabled: () => enabled,
    }
  },
  'apple': (enabled) => {
    return {
      test: () => true,
      page: (category, name, properties) => {},
      isEnabled: () => enabled,
    }
  },
  'orange': (enabled) => {
    return {
      test: () => true,
      alias: (userId, previousId) => {},
      isEnabled: () => enabled,
    }
  },
  'blueberry': (enabled) => {
    return {
      test: () => true,
      group: (userId, previousId) => {},
      isEnabled: () => enabled,
    }
  },
  'facebook': (enabled) => {
    return {
      test: () => true,
      facebookTrackEvent: (eventName, eventProperties, options, callback) => {},
      isEnabled: () => enabled
    }
  }
}

test('when eventlayer functions are called without initializing', () => {
  const EventLayer = EventLayerFactory()
  expect(() => EventLayer.track('potato', {})).toThrowError('Event Layer has not been initialized yet!')
  expect(() => EventLayer.identify('potato', {})).toThrowError('Event Layer has not been initialized yet!')
  expect(() => EventLayer.alias('potato', 'tomato')).toThrowError('Event Layer has not been initialized yet!')
  expect(() => EventLayer.group('potato', {})).toThrowError('Event Layer has not been initialized yet!')
  expect(() => EventLayer.page('potato', 'tomato', {})).toThrowError('Event Layer has not been initialized yet!')
  expect(() => EventLayer.fbTrack('potato', {})).toThrowError('Event Layer has not been initialized yet!')
})

test('make sure initialized variable is true after initialize method is called', () => {
  const EventLayer = EventLayerFactory()
  EventLayer.initialize({
    'google-analytics': {
      enabled: true,
    },
  })
  expect(EventLayer.isInitialized()).toEqual(true)
})

test('make sure initialized variable is false by default', () => {
  const EventLayer = EventLayerFactory()
  expect(EventLayer.isInitialized()).toEqual(false)
})

test('when identify is called, make sure it\'s custom transformer is called', () => {
  const config = {
    'potato': {
      enabled: true,
      transformers: {
        identityTransformer: (userId, userProperties) => {
          return {
            'userId': 'lakhanwa',
            'userProperties': {},
          }
        },
      },
    },
    'tomato': {
      enabled: true,
    },
    'banana': {
      enabled: true,
    },
    'apple': {
      enabled: false,
    },
  }
  const callBack = (data) => {
    expect(data).toBe('done')
  }
  const onReadyCallbackContainer = {
    onReadyCallback: () => {}
  }

  const EventLayer = EventLayerFactory()
  const initializeSpy = jest.spyOn(Initializer, 'initialize').mockImplementation(() => {
    return createInitializedAdapter(config)
  })
  EventLayer.initialize(config)
  const transformerSpy = jest.spyOn(config['potato']['transformers'], 'identityTransformer')

  const readyCallbackSpy = jest.spyOn(onReadyCallbackContainer, 'onReadyCallback')
  EventLayer.ready(onReadyCallbackContainer.onReadyCallback)
  EventLayer.identify('potato', {}, {}, callBack)
  expect(transformerSpy).toHaveBeenCalled()
  expect(readyCallbackSpy).toHaveBeenCalled()

  EventLayer.identify('potato', {})

  transformerSpy.mockRestore()
  initializeSpy.mockRestore()
})

test('when track is called, make sure it\'s custom transformer is called', () => {
  const config = {
    'potato': {
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
      },
    },
    'tomato': {
      enabled: true,
    },
    'banana': {
      enabled: true,
    },
    'apple': {
      enabled: false,
    },
  }
  const callBack = (data) => {
    expect(data).toBe('done')
  }
  const onReadyCallbackContainer = {
    onReadyCallback: () => {}
  }

  const EventLayer = EventLayerFactory()
  const initializeSpy = jest.spyOn(Initializer, 'initialize').mockImplementation(() => {
    return createInitializedAdapter(config)
  })
  EventLayer.initialize(config)
  const transformerSpy = jest.spyOn(config['potato']['transformers'], 'eventTransformer')

  const readyCallbackSpy = jest.spyOn(onReadyCallbackContainer, 'onReadyCallback')
  EventLayer.ready(onReadyCallbackContainer.onReadyCallback)
  EventLayer.track('customEvent', {}, {}, callBack)
  expect(transformerSpy).toHaveBeenCalled()
  expect(readyCallbackSpy).toHaveBeenCalled()

  EventLayer.track('potato', {})

  transformerSpy.mockRestore()
  initializeSpy.mockRestore()
  readyCallbackSpy.mockRestore()
})

test('when page is called, make sure it\'s custom transformer is called', () => {
  const config = {
    'potato': {
      enabled: true,
      transformers: {
        pageTransformer: (category, name, properties) => {
          return {
            'category': 'potato',
            'name': 'namewa',
            'properties': {},
          }
        },
      },
    },
    'tomato': {
      enabled: true,
    },
    'banana': {
      enabled: false,
    },
    'apple': {
      enabled: true,
    },
  }
  const callBack = (data) => {
    expect(data).toBe('done')
  }
  const onReadyCallbackContainer = {
    onReadyCallback: () => {}
  }

  const EventLayer = EventLayerFactory()
  const initializeSpy = jest.spyOn(Initializer, 'initialize').mockImplementation(() => {
    return createInitializedAdapter(config)
  })

  const pagePropsSpy = jest.spyOn(Page, 'getPageProps').mockImplementation(() => {
    return {
      url: 'https://potato.tomato',
    }
  })

  EventLayer.initialize(config)
  const transformerSpy = jest.spyOn(config['potato']['transformers'], 'pageTransformer')

  const readyCallbackSpy = jest.spyOn(onReadyCallbackContainer, 'onReadyCallback')
  EventLayer.ready(onReadyCallbackContainer.onReadyCallback)
  EventLayer.page('pen', 'Special Pen', {}, {}, callBack)
  expect(transformerSpy).toHaveBeenCalled()
  expect(pagePropsSpy).toHaveBeenCalled()
  expect(readyCallbackSpy).toHaveBeenCalled()

  EventLayer.page('potato', {})

  transformerSpy.mockRestore()
  pagePropsSpy.mockRestore()
  initializeSpy.mockRestore()
  readyCallbackSpy.mockRestore()
})

test('when group is called, make sure it\'s custom transformer is called', () => {
  const config = {
    'potato': {
      enabled: true,
      transformers: {
        groupTransformer: (groupId, traits) => {
          return {
            'groupId': 'groupId',
            'traits': {
              'khaaaaa': 'goooooo',
            },
          }
        },
      },
    },
    'tomato': {
      enabled: true,
    },
    'banana': {
      enabled: true,
    },
    'apple': {
      enabled: false,
    },
    'blueberry': {
      enabled: true
    }
  }
  const callBack = (data) => {
    expect(data).toBe('done')
  }
  const onReadyCallbackContainer = {
    onReadyCallback: () => {}
  }

  const EventLayer = EventLayerFactory()
  const initializeSpy = jest.spyOn(Initializer, 'initialize').mockImplementation(() => {
    return createInitializedAdapter(config)
  })
  EventLayer.initialize(config)
  const transformerSpy = jest.spyOn(config['potato']['transformers'], 'groupTransformer')

  const readyCallbackSpy = jest.spyOn(onReadyCallbackContainer, 'onReadyCallback')
  EventLayer.ready(onReadyCallbackContainer.onReadyCallback)
  EventLayer.group('customEvent', {}, {}, callBack)
  expect(transformerSpy).toHaveBeenCalled()
  expect(readyCallbackSpy).toHaveBeenCalled()

  EventLayer.group('potato', {})

  transformerSpy.mockRestore()
  initializeSpy.mockRestore()
  readyCallbackSpy.mockRestore()
})

test('when alias is called, make sure it\'s custom transformer is called', () => {
  const config = {
    'potato': {
      enabled: true,
      transformers: {
        aliasTransformer: (userId, previousId) => {
          return {
            'userId': 'potato@tomato.com',
            'previousId': 'falana@dekana.com'
          }
        },
      },
    },
    'tomato': {
      enabled: true,
    },
    'banana': {
      enabled: true,
    },
    'apple': {
      enabled: false,
    },
    'orange': {
      enabled: true
    }
  }
  const callBack = (data) => {
    expect(data).toBe('done')
  }

  const onReadyCallbackContainer = {
    onReadyCallback: () => {}
  }
  const EventLayer = EventLayerFactory()
  const initializeSpy = jest.spyOn(Initializer, 'initialize').mockImplementation(() => {
    return createInitializedAdapter(config)
  })
  EventLayer.initialize(config)
  const transformerSpy = jest.spyOn(config['potato']['transformers'], 'aliasTransformer')

  const readyCallbackSpy = jest.spyOn(onReadyCallbackContainer, 'onReadyCallback')
  EventLayer.ready(onReadyCallbackContainer.onReadyCallback)

  EventLayer.alias('123', '456', {}, callBack)
  expect(transformerSpy).toHaveBeenCalled()
  expect(readyCallbackSpy).toHaveBeenCalled()
  EventLayer.alias('123', '456', {})

  transformerSpy.mockRestore()
  initializeSpy.mockRestore()
})

test('when fbTrack is called, make sure it\'s custom transformer is called', () => {
  const config = {
    'potato': {
      enabled: true,
      transformers: {
        fbTransformer: (eventName, eventProperties) => {
          return {
            eventName: 'potato',
            eventProperties: {}
          }
        },
      },
    },
    'tomato': {
      enabled: true,
    },
    'banana': {
      enabled: true,
    },
    'apple': {
      enabled: false,
    },
    'orange': {
      enabled: true
    },
    'facebook': {
      enabled: true
    }
  }
  const callBack = (data) => {
    expect(data).toBe('done')
  }

  // Trying to cover the case when the ready callback is not a function
  const onReadyCallbackContainer = {
    onReadyCallback: "not a callback"
  }

  const EventLayer = EventLayerFactory()
  const initializeSpy = jest.spyOn(Initializer, 'initialize').mockImplementation(() => {
    return createInitializedAdapter(config)
  })


  EventLayer.initialize(config)
  const transformerSpy = jest.spyOn(config['potato']['transformers'], 'fbTransformer')

  EventLayer.fbTrack('123', {}, {}, callBack)
  expect(transformerSpy).toHaveBeenCalled()


  EventLayer.ready(onReadyCallbackContainer.onReadyCallback)
  EventLayer.fbTrack('123', {}, {}, callBack)
  expect(transformerSpy).toHaveBeenCalled()

  EventLayer.fbTrack('123', {})

  transformerSpy.mockRestore()
  initializeSpy.mockRestore()
})


/** To increase coverage **/
test('when identify is called, and no adapters are available', () => {
  const EventLayer = EventLayerFactory()
  EventLayer.initialize({})
  EventLayer.identify('potato', {})
})
/** To increase coverage **/
test('when event is called, and no adapters are available', () => {
  const EventLayer = EventLayerFactory()
  EventLayer.initialize({})
  EventLayer.track('potato', {})
})
/** To increase coverage **/
test('when page is called, and no adapters are available', () => {
  const EventLayer = EventLayerFactory()
  EventLayer.initialize({})
  EventLayer.page('potato', {})
})
/** To increase coverage **/
test('when group is called, and no adapters are available', () => {
  const EventLayer = EventLayerFactory()
  EventLayer.initialize({})
  EventLayer.group('potato', {})
})
/** To increase coverage **/
test('when alias is called, and no adapters are available', () => {
  const EventLayer = EventLayerFactory()
  EventLayer.initialize({})
  EventLayer.alias('potato', 'tomato')
})
/** To increase coverage **/
test('when fbTrack is called, and no adapters are available', () => {
  const EventLayer = EventLayerFactory()
  EventLayer.initialize({})
  EventLayer.fbTrack('potato', {})
})

function createInitializedAdapter (config) {
  const clonedAdapters = _.cloneDeep(mockAdapters)
  let initializedAdapters = {}
  _.forIn(config, (value, key) => {
    let adapter = clonedAdapters[key](value.enabled)
    initializedAdapters[key] = {
      transformers: value.transformers,
      adapter: adapter,
    }
  })

  return initializedAdapters
}