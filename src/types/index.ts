export type CropType =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Leafy Greens'
  | 'Root Crops'
  | 'Berries'
  | 'Dairy'
  | 'Honey';

export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  avatar: string;
  rating: number;
  totalListings: number;
  verified: boolean;
}

export interface Listing {
  id: string;
  cropName: string;
  cropType: CropType;
  image: string;
  gallery?: string[];
  pricePerUnit: number;
  unit: string;
  quantityAvailable: number;
  farmer: Farmer;
  location: string;
  distanceKm: number;
  qualityRating: number;
  harvestDate: string;
  organic: boolean;
  description: string;
}

export interface Bid {
  id: string;
  listingId: string;
  buyerName: string;
  amountPerUnit: number;
  quantity: number;
  placedAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export type OrderStage =
  | 'bid_placed'
  | 'bid_accepted'
  | 'harvest_scheduled'
  | 'out_for_delivery'
  | 'delivered';

export interface StatusEvent {
  stage: OrderStage;
  label: string;
  timestamp: string;
  complete: boolean;
}

export type TrackingStage = 'confirmed' | 'picked_up' | 'in_transit' | 'delivered';

export interface TrackingEvent {
  stage: TrackingStage;
  label: string;
  timestamp: string;
  complete: boolean;
}

export interface TransportReadout {
  temperatureC: number;
  humidityPct: number;
  lastLocation: string;
  lastUpdated: string;
}

export interface Order {
  id: string;
  cropName: string;
  cropImage: string;
  quantity: number;
  unit: string;
  buyerName: string;
  farmerName: string;
  farmerFarm: string;
  agreedPricePerUnit: number;
  totalPrice: number;
  placedAt: string;
  timeline: TrackingEvent[];
  transport: TransportReadout;
}

export interface FilterState {
  cropTypes: CropType[];
  maxDistanceKm: number;
  minPrice: number;
  maxPrice: number;
  organicOnly: boolean;
}

export type SortOption = 'nearest' | 'cheapest' | 'highest-rated';
export type ViewMode = 'list' | 'map';

export type ListingStatus = 'Active' | 'Sold' | 'Expired';

export type QuantityUnit = 'kg' | 'quintal' | 'ton';

export interface ListingFormData {
  cropName: string;
  cropType: CropType;
  quantity: number;
  unit: QuantityUnit;
  pricePerUnit: number;
  qualityRating: number;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  organic: boolean;
}

export interface DashboardListing {
  id: string;
  cropName: string;
  cropType: CropType;
  image: string;
  quantityAvailable: number;
  unit: string;
  pricePerUnit: number;
  status: ListingStatus;
  bidsCount: number;
  listedDate: string;
}

export interface DashboardStats {
  activeListings: number;
  pendingBids: number;
  completedSales: number;
  totalRevenue: number;
}
