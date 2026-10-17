export const reasons = [
  'health',
  'sleep',
  'money',
  'family',
  'clarity',
  'control',
  'fitness',
] as const;
export type Reason = (typeof reasons)[number];
