export type UserRole = 'CUSTOMER' | 'ADMIN';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type EventType =
  | 'GUSABA'
  | 'GUKWA'
  | 'CIVIL'
  | 'RELIGIOUS'
  | 'RECEPTION'
  | 'OTHER';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  GUSABA: 'Gusaba (asking)',
  GUKWA: 'Gukwa (dowry)',
  CIVIL: 'Civil ceremony',
  RELIGIOUS: 'Religious ceremony',
  RECEPTION: 'Reception',
  OTHER: 'Other',
};
