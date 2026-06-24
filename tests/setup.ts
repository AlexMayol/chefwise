jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en', languageTag: 'en-US' }],
}));

jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: () => null,
  DateTimePickerAndroid: { open: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: unknown }) => children,
  SafeAreaView: ({ children }: { children: unknown }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 320, height: 640 }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeItem: jest.fn(async () => undefined),
}));

jest.mock('expo-file-system', () => ({
  Paths: {
    document: { uri: 'file:///document/' },
    cache: { uri: 'file:///cache/' },
  },
  Directory: jest.fn().mockImplementation((base: { uri?: string } | string, path = '') => ({
    uri: `${typeof base === 'string' ? base : (base.uri ?? '')}${path}`,
    exists: false,
    create: jest.fn(),
  })),
  File: jest.fn().mockImplementation((base: { uri?: string } | string, path = '') => ({
    uri: `${typeof base === 'string' ? base : (base.uri ?? '')}${path}`,
    exists: false,
    copy: jest.fn(),
    delete: jest.fn(),
  })),
}));
