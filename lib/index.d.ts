
declare class EventLayerClass {
  constructor();

  initialize: (config: Config) => void;
  isInitialized: () => boolean;
  ready: (callback: (ready: string) => {}) => void;
  identify: <T>(userId: string, userProperties?: T) => void;
  track: <T>(eventName: string, eventProperties?: T) => void;
  page: <T>(category: string, name: string, properties?: T) => void;
  alias: (userId: string, previousId?: string) => void;
  group: <T>(groupId: string, traits?: T) => void;
  fbTrack: <T>(eventName: string, eventProperties?: T) => void;
}

type Config = {
  [name: string]: ConfigItem
}

interface ConfigItem {
  enabled: boolean
  transformers: Transformers
}

interface Identity {
  userId: String
  userProperties?: any
}

interface EventLayerEvent {
  eventName: string
  eventProperties?: any
}

interface PageEvent {
  category: string
  name: string
  properties?: any
}

interface AliasEvent {
  userId: string
  previousId: string
}

interface GroupEvent {
  groupId: string
  traits?: any
}

interface FBEvent {
  eventName: string
  eventProperties?: any
}

interface Transformers {
  identityTransformer?: <T>(userId: string, userProperties?: T) => Identity;
  eventTransformer?: <T>(eventName: string, eventProperties?: T) => EventLayerEvent;
  pageTransformer: <T>(category: string, name: string, properties?: T) => PageEvent;
  aliasTransformer: (userId: string, previousId?: string) => AliasEvent;
  groupTransformer: <T>(groupId: string, traits?: T) => GroupEvent;
  fbTrackTransformer: <T>(eventName: string, eventProperties?: T) => FBEvent;
}


export const EventLayerFactory: () => EventLayerClass;
export const EventLayer: EventLayerClass;
