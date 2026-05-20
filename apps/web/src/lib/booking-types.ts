export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export type EventType =
  | 'GUSABA'
  | 'GUKWA'
  | 'CIVIL'
  | 'RELIGIOUS'
  | 'RECEPTION'
  | 'OTHER';

export interface BookingItem {
  id: string;
  priceAtBooking: number;
  rentalItem: {
    id: string;
    name: string;
    images: string[];
    category: { name: string };
  };
}

export interface Booking {
  id: string;
  userId: string;
  eventDate: string;
  eventType: EventType;
  status: BookingStatus;
  notes: string | null;
  totalPrice: number;
  createdAt: string;
  items: BookingItem[];
  user?: { id: string; name: string; email: string; phone: string | null };
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  GUSABA: 'Gusaba',
  GUKWA: 'Gukwa',
  CIVIL: 'Civil',
  RELIGIOUS: 'Religious',
  RECEPTION: 'Reception',
  OTHER: 'Other',
};
