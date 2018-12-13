# Event Layer for Analytics

[![Build Status](https://travis-ci.org/sumitsarkar/event-layer.svg?branch=master)](https://travis-ci.org/sumitsarkar/event-layer)
[![Coverage Status](https://codecov.io/gh/sumitsarkar/event-layer/branch/master/graph/badge.svg)](https://codecov.io/gh/sumitsarkar/event-layer/branch/master)

![Setup Instructions](docs/analytics.png)

This module is heavily inspired from [Event Layer](https://github.com/kidGodzilla/event-layer). We have made it more configurable by providing more options and extensions on top of it.

Currently supported adapters:

* [Segment](https://segment.com/)
* [Mixpanel](https://mixpanel.com/)
* [Google Analytics](https://analytics.google.com/analytics/web/)
* [Google Tag Manager](https://tagmanager.google.com/)
* [Facebook Tracking Pixel](https://developers.facebook.com/docs/facebook-pixel/)
* [Heap Analytics](https://heapanalytics.com/)
* [Intercom](https://www.intercom.com/)
* [Amplitude](https://amplitude.com/)
* [Keen.io](https://keen.io/)
* [Helpscout](https://www.helpscout.net/)
* [FullStory](https://www.fullstory.com/)
* [Olark](https://www.olark.com/)
* [Calq](https://calq.io/)
* [Sentry](https://sentry.io/)
* [Castle](https://castle.io/)
* [Rollbar](https://rollbar.com/)
* [Talkus](https://talkus.io/)
* [Elev.io](https://elev.io/)
* [Drift](https://www.drift.com/)
* [Drip](https://www.drip.com/)
* [Lucky Orange](https://www.luckyorange.com)
* [Bugsnag](https://www.bugsnag.com/)
* [Bugsnag](https://www.bugsnag.com/)
* [Improvely](https://www.improvely.com/)
* [Inspectlet](https://www.inspectlet.com)
* [Qualaroo](https://qualaroo.com/)
* [Customerio](https://customer.io/)
* [Chameleon](https://www.trychameleon.com/)

If you require more adapters to be integrated, feel free to raise a pull request or reach us out on our support channel so that we can integrate your favorite tool with this library.

## Inspiration

This Javascript package aims to remain a destination agnostic interface for all kinds of custom events generated in the browser when a user interacts with it. It's basically a router of events to different destinations. 

## Setup

![Setup Instructions](docs/setup.png)

> This library is distributed via the ABC Artifactory. Please reach out to [abcsupport@cimpress.com](mailto:abcsupport@cimpress.com) to get access to the Artifactory.

1. Install the library using 
    ```sh
    npm install @abc/event-layer
    ```
2. When added to a page, the library exports `EventLayer` object to the `window` object of the DOM. However, it requires initialization for you to be able to use any of the other functions in `EventLayer.EventLayer`. For more options look at [Configuration Options](#configuration-options)
    ```javascript
    const Analytics = EventLayer.EventLayer
    Analytics.initialize({
      'google-analytics': {
         enabled: true
       }
    })
    ```
3. Now that the EventLayer is initialized, you can send your custom events to the layer:
    ```javascript
    Analytics.page('product', 'Flyers', {
      'category': 'Stationary',
      'my-custom-property': 'My Custom Property Value'
    })
    ```


## Configuration Options

![Configuration](docs/settings.png)

One can configure each adapter to spew different outputs if they wish to. The interface for the configuration is:
```javascript
{
  'name-of-adapter': {
    enabled: true | false,
    transformers: {
      identityTransformer: (userId, userProperties) => {
        return {
          userId: 'transformedUserId',
          userProperties: {
            'property1': 'value1'
          }
        }
      }
      eventTransformer: (eventName, eventProperties) => {
        return {
          eventName: 'transformedEventName',
          eventProperties: {
            'property1': 'value1'
          }
        }
      }
    }
  }
}
```

The following transformers can be added in the adapter configuration: `eventTransformer`, `identityTransformer`, `pageTransformer`, `aliasTransformer`, `groupTransformer` and `fbTrackTransformer`. To find more about the interface please refer to the TypeScript definition: [Definitions](lib/index.d.ts)

Following are the adapter names that you can modify in the configuration:

```javascript
'amplitude'
'bugsnag'
'calq'
'castle'
'chameleon'
'customerio'
'drift'
'drip'
'elvio'
'facebookTrackingPixel'
'fullstory'
'google-analytics'
'google-tag-manager'
'heap'
'helpscout'
'improvely'
'inspectlet'
'intercom'
'keen'
'luckyorange'
'mixpanel'
'olark'
'qualaroo'
'rollbar'
'segment'
'sentry'
'talkus'
```