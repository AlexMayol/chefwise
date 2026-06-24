import type { ViewStyle } from 'react-native';

// Warm, soft elevation tuned for the cream "paper" surfaces.
// `card` lifts surfaces gently; `raised` gives filled actions a tactile, tinted lift.
export const elevation = {
  card: {
    shadowColor: '#4a301e',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  raised: {
    shadowColor: '#5a2410',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
} satisfies Record<string, ViewStyle>;
