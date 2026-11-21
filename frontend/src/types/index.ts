export type UserRole = 'GUEST' | 'HOST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export interface ListingImage {
  id: string | number;
  image_url: string;
  display_order: number;
}

export interface Amenity {
  id: number;
  name: string;
}

export interface HostBrief {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface ListingCard {
  id: string;
  title: string;
  location: string;
  property_type: string;
  price_per_night: number;
  rating: number;
  review_count: number;
  images: ListingImage[];
  host_id?: string;
  max_guests?: number;
}

export interface ListingDetail {
  id: string;
  host_id: string;
  title: string;
  description: string;
  property_type: string;
  location: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  images: ListingImage[];
  amenities: Amenity[];
  host: HostBrief;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingResponse {
  id: string;
  listing_id: string;
  guest_id: string;
  host_id?: string;
  check_in: string;
  check_out: string;
  guests: number;
  nightly_price: number;
  nights: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: BookingStatus;
  created_at: string;
}

export interface BookingWithListing extends BookingResponse {
  listing_title: string;
  listing_location: string;
  listing_image: string | null;
}

export interface PriceBreakdown {
  nightly_price: number;
  nights: number;
  nightly_subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  total: number;
}

export interface AvailabilityResponse {
  available: boolean;
  price_breakdown: PriceBreakdown | null;
}

export interface Review {
  id: string | number;
  listing_id: string;
  user_id: string;
  booking_id?: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_avatar: string | null;
}

export interface WishlistItem {
  id: string | number;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface WishlistWithListing extends WishlistItem {
  listing_title: string;
  listing_location: string;
  listing_price: number;
  listing_rating: number;
  listing_image: string | null;
}

export interface ListingsResponse {
  items: ListingCard[];
  page: number;
  page_size: number;
  total: number;
  has_next: boolean;
}

export interface ListingCreate {
  title: string;
  description?: string;
  property_type?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  max_guests: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  amenity_ids?: number[];
  images: { image_url: string; display_order: number }[] | string[];
}

export interface ListingUpdate extends Partial<ListingCreate> {}

export interface BackendProperty {
  id: string;
  hostId: string;
  name: string;
  location: string;
  pricePerDay: number | string;
  maxGuests: number;
  imageUrls: string[];
}

export interface BackendBooking {
  id: string;
  guestId: string;
  hostId: string;
  propertyId: string;
  startsAt: string;
  endsAt: string;
  guestCount: number;
  totalAmount: string | number;
  status: BookingStatus;
}

export interface ConversationResponse {
  id: string | number;
  listing_id: string;
  guest_id: string;
  host_id: string;
  listing_title: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string | number;
  conversation_id: string | number;
  sender_id: string;
  sender_name: string;
  sender_avatar: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface SearchParams {
  location?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  amenities?: string;
  page?: number;
  page_size?: number;
}
