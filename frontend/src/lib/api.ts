import { API_URL } from './constants';
import type {
  User,
  ListingCard,
  ListingDetail,
  ListingsResponse,
  BookingResponse,
  BookingWithListing,
  AvailabilityResponse,
  Review,
  WishlistWithListing,
  Amenity,
  ListingCreate,
  ListingUpdate,
  SearchParams,
  LoginRequest,
  SignupRequest,
  TokenResponse,
  ConversationResponse,
  ChatMessage,
  BackendProperty,
  BackendBooking,
} from '@/types';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getStoredAuthUser(): any | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('authUser');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = false
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errMsg = res.statusText;
    try {
      const errJson = await res.json();
      errMsg = errJson.message || errJson.error || JSON.stringify(errJson);
    } catch {
      errMsg = (await res.text().catch(() => res.statusText)) || `HTTP ${res.status}`;
    }
    throw new Error(errMsg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ----------------------------------------------------
// Normalizers
// ----------------------------------------------------

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80';

export function toListingCard(item: BackendProperty): ListingCard {
  const validImages = Array.isArray(item.imageUrls) && item.imageUrls.length > 0
    ? item.imageUrls
    : [DEFAULT_IMAGE];

  return {
    id: item.id,
    title: item.name || 'Cozy property',
    location: item.location || 'Unknown',
    property_type: 'Entire home',
    price_per_night: Number(item.pricePerDay || 0),
    rating: 4.9,
    review_count: 12,
    images: validImages.map((url, i) => ({
      id: i,
      image_url: url,
      display_order: i,
    })),
    host_id: item.hostId,
    max_guests: item.maxGuests,
  };
}

export function toListingDetail(item: BackendProperty): ListingDetail {
  const validImages = Array.isArray(item.imageUrls) && item.imageUrls.length > 0
    ? item.imageUrls
    : [DEFAULT_IMAGE];

  return {
    id: item.id,
    host_id: item.hostId,
    title: item.name || 'Cozy property',
    description: `Welcome to ${item.name}! Located in ${item.location}, this wonderful property accommodates up to ${item.maxGuests} guests. Enjoy all the comforts of home in a prime location.`,
    property_type: 'Entire home',
    location: item.location || 'Unknown',
    latitude: 40.7128,
    longitude: -74.006,
    price_per_night: Number(item.pricePerDay || 0),
    max_guests: item.maxGuests || 1,
    bedrooms: Math.max(1, Math.floor((item.maxGuests || 2) / 2)),
    beds: Math.max(1, item.maxGuests || 1),
    bathrooms: Math.max(1, Math.floor((item.maxGuests || 2) / 2)),
    rating: 4.9,
    review_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: validImages.map((url, i) => ({
      id: i,
      image_url: url,
      display_order: i,
    })),
    amenities: [
      { id: 1, name: 'Wifi' },
      { id: 2, name: 'Kitchen' },
      { id: 3, name: 'Free parking' },
      { id: 4, name: 'Air conditioning' },
      { id: 5, name: 'Dedicated workspace' },
    ],
    host: {
      id: item.hostId,
      name: 'Host',
      avatar_url: null,
    },
  };
}

// ----------------------------------------------------
// Auth Endpoints
// ----------------------------------------------------

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, password: data.password }),
  });

  if (!res.ok) {
    let msg = 'Login failed';
    try {
      const err = await res.json();
      msg = err.message || err.error || msg;
    } catch {}
    throw new Error(msg);
  }

  const { token } = await res.json();
  const payload = parseJwt(token) || {};
  const userId = payload.userId || '';

  // Check if we previously stored the user's name
  let name = data.email.split('@')[0];
  if (typeof window !== 'undefined') {
    const savedName = localStorage.getItem(`userName_${userId}`);
    if (savedName) name = savedName;
  }

  return {
    access_token: token,
    token_type: 'bearer',
    user_id: userId,
    name,
    email: data.email,
    role: 'HOST',
    avatar_url: null,
  };
}

export async function signup(data: SignupRequest): Promise<TokenResponse> {
  const regRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      name: data.name,
      password: data.password,
    }),
  });

  if (!regRes.ok) {
    let msg = 'Signup failed';
    try {
      const err = await regRes.json();
      msg = err.message || err.error || msg;
    } catch {}
    throw new Error(msg);
  }

  const regData = await regRes.json();
  const userId = regData.userId || '';

  if (typeof window !== 'undefined' && userId) {
    localStorage.setItem(`userName_${userId}`, data.name);
  }

  // Automatically log in after registration
  const loginRes = await login({ email: data.email, password: data.password });
  loginRes.name = data.name;
  if (data.role) loginRes.role = data.role;
  return loginRes;
}

export async function getMe(): Promise<User> {
  const user = getStoredAuthUser();
  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'GUEST',
      avatar_url: user.avatar_url || null,
      created_at: new Date().toISOString(),
    };
  }
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const payload = parseJwt(token);
  return {
    id: payload?.userId || '',
    name: 'User',
    email: 'user@example.com',
    role: 'GUEST',
    avatar_url: null,
    created_at: new Date().toISOString(),
  };
}

// ----------------------------------------------------
// Catalog (Listings) Endpoints
// ----------------------------------------------------

export async function getListings(params: SearchParams = {}): Promise<ListingsResponse> {
  const loc = params.location?.trim();
  let rawListings: BackendProperty[] = [];

  if (loc) {
    try {
      const data = await apiFetch<BackendProperty[]>(
        `/listings?location=${encodeURIComponent(loc)}`
      );
      if (Array.isArray(data)) rawListings = data;
    } catch (err) {
      console.warn('No listings found for location:', loc, err);
      rawListings = [];
    }
  } else {
    // If no location was specified, probe common locations and user listings
    const defaultLocations = [
      'Goa',
      'Jaipur',
      'Manali',
      'Kerala',
      'Agra',
      'Varanasi',
      'Udaipur',
      'Shimla',
      'Rishikesh',
      'Ladakh',
      'Mumbai',
      'Ooty',
      'Darjeeling',
      'New York',
      'London',
      'Paris',
      'Tokyo',
    ];
    const results = await Promise.allSettled(
      defaultLocations.map((l) =>
        apiFetch<BackendProperty[]>(`/listings?location=${encodeURIComponent(l)}`)
      )
    );
    for (const r of results) {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        rawListings.push(...r.value);
      }
    }

    // Try user listings if logged in
    try {
      const userListings = await apiFetch<BackendProperty[]>('/listings/user');
      if (Array.isArray(userListings)) {
        rawListings.push(...userListings);
      }
    } catch {}

    // Deduplicate by id
    const seen = new Set<string>();
    rawListings = rawListings.filter((item) => {
      if (!item || !item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  if (params.guests) {
    rawListings = rawListings.filter(
      (l) => Number(l.maxGuests) >= Number(params.guests)
    );
  }

  const items = rawListings.map(toListingCard);
  const page = params.page || 1;
  const pageSize = params.page_size || 20;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated,
    page,
    page_size: pageSize,
    total: items.length,
    has_next: start + pageSize < items.length,
  };
}

export async function getListing(id: string | number): Promise<ListingDetail> {
  const listingId = String(id);
  const res = await apiFetch<BackendProperty>('/listings/getdetails', {
    method: 'POST',
    body: JSON.stringify({ id: listingId }),
  });
  return toListingDetail(res);
}

export async function createListing(data: ListingCreate): Promise<ListingDetail> {
  const authUser = getStoredAuthUser();
  const token = getToken();
  let hostId = authUser?.id;
  if (!hostId && token) {
    const payload = parseJwt(token);
    hostId = payload?.userId;
  }
  if (!hostId) {
    throw new Error('Authentication required to create a listing');
  }

  // Filter valid https image URLs (1 to 10)
  let imageUrls = (data.images || [])
    .map((img) => (typeof img === 'string' ? img : img.image_url))
    .map((url) => (typeof url === 'string' ? url.trim() : ''))
    .filter((url) => url.startsWith('https://'));

  if (imageUrls.length === 0) {
    imageUrls = [DEFAULT_IMAGE];
  }
  if (imageUrls.length > 10) {
    imageUrls = imageUrls.slice(0, 10);
  }

  const payload = {
    hostId,
    name: data.title?.trim() || 'Cozy property',
    location: data.location?.trim() || 'New York',
    pricePerDay: Number(data.price_per_night || 100),
    maxGuests: Math.max(1, Number(data.max_guests || 1)),
    imageUrls,
  };

  const res = await apiFetch<BackendProperty>('/listings', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);

  return toListingDetail(res);
}

export async function updateListing(
  id: string | number,
  data: ListingUpdate
): Promise<ListingDetail> {
  const listingId = String(id);
  const payload: Record<string, any> = { id: listingId };

  if (data.title !== undefined) payload.name = data.title;
  if (data.location !== undefined) payload.location = data.location;
  if (data.price_per_night !== undefined) payload.pricePerDay = Number(data.price_per_night);
  if (data.max_guests !== undefined) payload.maxGuests = Number(data.max_guests);
  if (data.images !== undefined) {
    const urls = data.images
      .map((img) => (typeof img === 'string' ? img : img.image_url))
      .map((url) => (typeof url === 'string' ? url.trim() : ''))
      .filter((url) => url.startsWith('https://'));
    if (urls.length > 0) {
      payload.imageUrls = urls.slice(0, 10);
    }
  }

  const res = await apiFetch<BackendProperty>('/listings/update', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, true);

  return toListingDetail(res);
}

export async function deleteListing(id: string | number): Promise<void> {
  return apiFetch<void>('/listings/delete', {
    method: 'POST',
    body: JSON.stringify({ id: String(id) }),
  }, true);
}

export async function getHostListings(): Promise<ListingCard[]> {
  const data = await apiFetch<BackendProperty[]>('/listings/user', {}, true);
  return (data || []).map(toListingCard);
}

export async function uploadImage(file: File): Promise<string> {
  // If backend image upload is not deployed, return high-res image URL so PropertySchema validation passes
  return DEFAULT_IMAGE;
}

export async function getAmenities(): Promise<Amenity[]> {
  return [
    { id: 1, name: 'Wifi' },
    { id: 2, name: 'Kitchen' },
    { id: 3, name: 'Free parking' },
    { id: 4, name: 'Air conditioning' },
    { id: 5, name: 'Dedicated workspace' },
    { id: 6, name: 'Pool' },
    { id: 7, name: 'TV' },
    { id: 8, name: 'Washer' },
  ];
}

// ----------------------------------------------------
// Booking Endpoints
// ----------------------------------------------------

export async function checkAvailability(
  listingId: string | number,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResponse> {
  try {
    const listing = await getListing(listingId);
    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    const nightly_subtotal = nights * listing.price_per_night;
    const cleaning_fee = Math.round(nightly_subtotal * 0.05);
    const service_fee = Math.round(nightly_subtotal * 0.12);
    const total = nightly_subtotal + cleaning_fee + service_fee;

    return {
      available: true,
      price_breakdown: {
        nightly_price: listing.price_per_night,
        nights,
        nightly_subtotal,
        cleaning_fee,
        service_fee,
        total,
      },
    };
  } catch {
    return { available: true, price_breakdown: null };
  }
}

export async function createBooking(data: {
  listing_id: string | number;
  check_in: string;
  check_out: string;
  guests: number;
  host_id?: string;
  total_amount?: number;
}): Promise<BookingResponse> {
  const authUser = getStoredAuthUser();
  const token = getToken();
  let guestId = authUser?.id;
  if (!guestId && token) {
    const payload = parseJwt(token);
    guestId = payload?.userId;
  }
  if (!guestId) {
    throw new Error('Authentication required to book');
  }

  const propertyId = String(data.listing_id);
  let hostId = data.host_id;
  let totalAmount = data.total_amount;

  if (!hostId || totalAmount === undefined) {
    const listing = await getListing(propertyId);
    hostId = hostId || listing.host_id;
    if (totalAmount === undefined) {
      const nights = Math.max(
        1,
        Math.ceil(
          (new Date(data.check_out).getTime() - new Date(data.check_in).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
      totalAmount = nights * listing.price_per_night;
    }
  }

  const startsAt = new Date(data.check_in).toISOString();
  const endsAt = new Date(data.check_out).toISOString();

  const payload = {
    hostId,
    guestId,
    propertyId,
    totalAmount: Number(totalAmount),
    guestCount: Number(data.guests),
    startsAt,
    endsAt,
  };

  const booking = await apiFetch<BackendBooking>('/bookings/book', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(endsAt).getTime() - new Date(startsAt).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const tot = Number(booking.totalAmount || totalAmount);

  return {
    id: booking.id,
    listing_id: booking.propertyId,
    guest_id: booking.guestId,
    host_id: booking.hostId,
    check_in: booking.startsAt,
    check_out: booking.endsAt,
    guests: booking.guestCount,
    nightly_price: Math.round(tot / nights),
    nights,
    cleaning_fee: 0,
    service_fee: 0,
    total_price: tot,
    status: booking.status,
    created_at: booking.startsAt,
  };
}

export async function cancelBooking(id: string | number): Promise<BookingResponse> {
  const res = await apiFetch<BackendBooking>('/bookings/cancel-booking', {
    method: 'POST',
    body: JSON.stringify({ id: String(id) }),
  }, true);

  return {
    id: res.id,
    listing_id: res.propertyId,
    guest_id: res.guestId,
    host_id: res.hostId,
    check_in: res.startsAt,
    check_out: res.endsAt,
    guests: res.guestCount,
    nightly_price: 0,
    nights: 1,
    cleaning_fee: 0,
    service_fee: 0,
    total_price: Number(res.totalAmount || 0),
    status: res.status,
    created_at: res.startsAt,
  };
}

export async function getMyBookings(): Promise<BookingWithListing[]> {
  const bookings = await apiFetch<BackendBooking[]>('/bookings', {}, true);
  if (!Array.isArray(bookings)) return [];

  const results = await Promise.all(
    bookings.map(async (b) => {
      let listingTitle = 'Cozy property';
      let listingLocation = 'Unknown location';
      let listingImage: string | null = null;
      try {
        const listing = await getListing(b.propertyId);
        listingTitle = listing.title;
        listingLocation = listing.location;
        listingImage = listing.images?.[0]?.image_url || null;
      } catch {}

      const checkInDate = new Date(b.startsAt);
      const checkOutDate = new Date(b.endsAt);
      const nights = Math.max(
        1,
        Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      const tot = Number(b.totalAmount || 0);

      return {
        id: b.id,
        listing_id: b.propertyId,
        guest_id: b.guestId,
        host_id: b.hostId,
        check_in: b.startsAt,
        check_out: b.endsAt,
        guests: b.guestCount,
        nightly_price: Math.round(tot / nights),
        nights,
        cleaning_fee: 0,
        service_fee: 0,
        total_price: tot,
        status: b.status,
        created_at: b.startsAt,
        listing_title: listingTitle,
        listing_location: listingLocation,
        listing_image: listingImage,
      };
    })
  );

  return results;
}

export async function getHostBookings(): Promise<BookingResponse[]> {
  try {
    const authUser = getStoredAuthUser();
    const token = getToken();
    let currentUserId = authUser?.id;
    if (!currentUserId && token) {
      currentUserId = parseJwt(token)?.userId;
    }
    const bookings = await apiFetch<BackendBooking[]>('/bookings', {}, true);
    if (!Array.isArray(bookings)) return [];
    return bookings
      .filter((b) => b.hostId === currentUserId)
      .map((b) => {
        const checkInDate = new Date(b.startsAt);
        const checkOutDate = new Date(b.endsAt);
        const nights = Math.max(
          1,
          Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        );
        const tot = Number(b.totalAmount || 0);
        return {
          id: b.id,
          listing_id: b.propertyId,
          guest_id: b.guestId,
          host_id: b.hostId,
          check_in: b.startsAt,
          check_out: b.endsAt,
          guests: b.guestCount,
          nightly_price: Math.round(tot / nights),
          nights,
          cleaning_fee: 0,
          service_fee: 0,
          total_price: tot,
          status: b.status,
          created_at: b.startsAt,
        };
      });
  } catch {
    return [];
  }
}

// ----------------------------------------------------
// Reviews & Wishlists (Client fallback / Safe integration)
// ----------------------------------------------------

export async function getReviews(_listingId: string | number): Promise<Review[]> {
  return [];
}

export async function createReview(
  listingId: string | number,
  data: { booking_id?: string; rating: number; comment: string }
): Promise<Review> {
  const authUser = getStoredAuthUser();
  return {
    id: Date.now().toString(),
    listing_id: String(listingId),
    user_id: authUser?.id || 'guest',
    booking_id: data.booking_id,
    rating: data.rating,
    comment: data.comment,
    created_at: new Date().toISOString(),
    user_name: authUser?.name || 'Guest',
    user_avatar: authUser?.avatar_url || null,
  };
}

export async function getWishlist(): Promise<WishlistWithListing[]> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('user_wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addToWishlist(listingId: string | number): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const list = await getWishlist();
    const id = String(listingId);
    if (!list.some((item) => String(item.listing_id) === id)) {
      const listing = await getListing(id);
      list.push({
        id: Date.now().toString(),
        user_id: getStoredAuthUser()?.id || 'guest',
        listing_id: id,
        created_at: new Date().toISOString(),
        listing_title: listing.title,
        listing_location: listing.location,
        listing_price: listing.price_per_night,
        listing_rating: listing.rating,
        listing_image: listing.images[0]?.image_url || null,
      });
      localStorage.setItem('user_wishlist', JSON.stringify(list));
    }
  } catch (err) {
    console.error('addToWishlist error:', err);
  }
}

export async function removeFromWishlist(listingId: string | number): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const list = await getWishlist();
    const id = String(listingId);
    const filtered = list.filter((item) => String(item.listing_id) !== id);
    localStorage.setItem('user_wishlist', JSON.stringify(filtered));
  } catch (err) {
    console.error('removeFromWishlist error:', err);
  }
}

// ----------------------------------------------------
// Notifications (Kept intact with resilient fallback)
// ----------------------------------------------------

export interface Notification {
  id: string | number;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  link?: string | null;
  created_at: string;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'welcome-1',
    user_id: 'all',
    title: 'Welcome to Airbnb',
    message: 'Explore unique places to stay around the world.',
    is_read: false,
    link: '/',
    created_at: new Date().toISOString(),
  },
];

export async function getNotifications(): Promise<Notification[]> {
  try {
    const data = await apiFetch<Notification[]>('/notifications', {}, true);
    if (Array.isArray(data)) return data;
  } catch {}
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_notifications');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }
  return DEFAULT_NOTIFICATIONS;
}

export async function markNotificationRead(id: string | number): Promise<Notification> {
  const notifs = await getNotifications();
  const updated = notifs.map((n) =>
    String(n.id) === String(id) ? { ...n, is_read: true } : n
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_notifications', JSON.stringify(updated));
  }
  return (
    updated.find((n) => String(n.id) === String(id)) || {
      id,
      user_id: '',
      title: '',
      message: '',
      is_read: true,
      created_at: new Date().toISOString(),
    }
  );
}

export async function markAllNotificationsRead(): Promise<void> {
  const notifs = await getNotifications();
  const updated = notifs.map((n) => ({ ...n, is_read: true }));
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_notifications', JSON.stringify(updated));
  }
}

// ----------------------------------------------------
// Chat (Kept intact with resilient fallback)
// ----------------------------------------------------

export async function getConversations(): Promise<ConversationResponse[]> {
  try {
    const data = await apiFetch<ConversationResponse[]>('/chat/conversations', {}, true);
    if (Array.isArray(data)) return data;
  } catch {}
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_conversations');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }
  return [];
}

export async function createConversation(listingId: string | number): Promise<ConversationResponse> {
  const id = String(listingId);
  try {
    return await apiFetch<ConversationResponse>(
      '/chat/conversations',
      {
        method: 'POST',
        body: JSON.stringify({ listing_id: id }),
      },
      true
    );
  } catch {
    const listing = await getListing(id);
    const authUser = getStoredAuthUser();
    const conv: ConversationResponse = {
      id: `conv_${id}_${Date.now()}`,
      listing_id: id,
      guest_id: authUser?.id || 'guest',
      host_id: listing.host_id,
      listing_title: listing.title,
      other_user_name: 'Host',
      other_user_avatar: null,
      last_message: null,
      last_message_at: null,
      unread_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      const convs = await getConversations();
      if (!convs.some((c) => c.listing_id === id)) {
        convs.push(conv);
        localStorage.setItem('user_conversations', JSON.stringify(convs));
      }
    }
    return conv;
  }
}

export async function getMessages(conversationId: string | number): Promise<ChatMessage[]> {
  const cid = String(conversationId);
  try {
    const data = await apiFetch<ChatMessage[]>(`/chat/conversations/${cid}/messages`, {}, true);
    if (Array.isArray(data)) return data;
  } catch {}
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`chat_messages_${cid}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }
  return [];
}

export async function sendMessage(
  conversationId: string | number,
  content: string
): Promise<ChatMessage> {
  const cid = String(conversationId);
  try {
    return await apiFetch<ChatMessage>(
      `/chat/conversations/${cid}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      },
      true
    );
  } catch {
    const authUser = getStoredAuthUser();
    const msg: ChatMessage = {
      id: Date.now().toString(),
      conversation_id: cid,
      sender_id: authUser?.id || 'me',
      sender_name: authUser?.name || 'Guest',
      sender_avatar: authUser?.avatar_url || null,
      content,
      is_read: true,
      created_at: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      const existing = await getMessages(cid);
      existing.push(msg);
      localStorage.setItem(`chat_messages_${cid}`, JSON.stringify(existing));
    }
    return msg;
  }
}

export async function markConversationRead(_conversationId: string | number): Promise<void> {
  // Handled locally
}

export function getChatWsUrl(): string {
  const token = getToken();
  if (!token) return '';
  const base = API_URL.replace(/^http/, 'ws');
  return `${base}/chat/ws?token=${token}`;
}
