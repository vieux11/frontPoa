export interface EventType {
    id?: number
    title: string
    description: string
    location: string
    eventDate: string
    heure?: string
    maxParticipants: number
    image: string 
    adminId?: number
    adminFullName?: string
    createdAt?: string
    updatedAt?: string
}
export interface EventTypeSend {
    id?: number
    title: string
    description: string
    location: string
    eventDate: string
    heure?: string
    maxParticipants: number
    image: File
    adminId?: number
    adminFullName?: string
    createdAt?: string
    updatedAt?: string
}

export interface ReservationSummary {
  eventId: number;
  eventTitle: string;
  totalPlaces: number;
  reservedCount: number;
  availablePlaces: number;
  reservationList: {
    clientName: string;
    coupon: string;
  }[];
}
