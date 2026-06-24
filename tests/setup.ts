jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en', languageTag: 'en-US' }],
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
