export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8080`
    : (process.env.INTERNAL_API_URL || process.env.BACKEND_URL || 'http://localhost:8080'));

export const PROPERTY_TYPES = [
  'APARTMENT',
  'HOUSE',
  'VILLA',
  'CABIN',
  'COTTAGE',
  'STUDIO',
  'LOFT',
  'BUNGALOW',
  'UNIQUE',
];

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🏠' },
  { id: 'Goa', label: 'Goa', icon: '🏖️' },
  { id: 'Jaipur', label: 'Jaipur', icon: '🏰' },
  { id: 'Manali', label: 'Manali', icon: '🏔️' },
  { id: 'Kerala', label: 'Kerala', icon: '🌴' },
  { id: 'Agra', label: 'Agra', icon: '🕌' },
  { id: 'Varanasi', label: 'Varanasi', icon: '🪔' },
  { id: 'Udaipur', label: 'Udaipur', icon: '⛵' },
  { id: 'Shimla', label: 'Shimla', icon: '🌲' },
  { id: 'Rishikesh', label: 'Rishikesh', icon: '🧘' },
  { id: 'Ladakh', label: 'Ladakh', icon: '⛰️' },
  { id: 'Mumbai', label: 'Mumbai', icon: '🌆' },
  { id: 'Ooty', label: 'Ooty', icon: '🫖' },
  { id: 'Darjeeling', label: 'Darjeeling', icon: '🚞' },
];
