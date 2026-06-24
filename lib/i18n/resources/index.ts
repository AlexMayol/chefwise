import { en } from './en';
import { es } from './es';

export const resources = {
  en,
  es,
} as const;

export type SupportedLocale = keyof typeof resources;
