import type { ViewStyle } from 'react-native';

// Clean, subtle elevation for the light surfaces.
// `card` is a barely-there lift; `raised` gives filled actions a soft neutral shadow.
export const elevation = {
  card: {
    shadowColor: '#1c1f1d',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#1c1f1d',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
} satisfies Record<string, ViewStyle>;
