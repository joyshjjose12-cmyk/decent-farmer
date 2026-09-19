import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Map,
  List,
  ChevronDown,
  Sprout,
  X,
  Gavel,
  Check,
} from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import FilterModal from '@/components/FilterModal';
import StarRating from '@/components/StarRating';
import BidFeed from '@/components/BidFeed';
import StatusTimeline from '@/components/StatusTimeline';
import { listings, bids, orderTimeline } from '@/data/mockData';
import type {
  Bid,
  FilterState,
  Listing,
  SortOption,
  ViewMode,
} from '@/types';

const defaultFilters: FilterState = {
  cropTypes: [],
  maxDistanceKm: 50,
  minPrice: 0,
  maxPrice: 500,
  organicOnly: false,
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'nearest', label: 'Nearest' },
  { value: 'cheapest', label: 'Cheapest' },
  { value: 'highest-rated', label: 'Highest rated' },
];

export default function MarketplacePage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<SortOption>('nearest');
  const [view, setView] = useState<ViewMode>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const navigate = useNavigate();

  const activeFilterCount =
    filters.cropTypes.length +
    (filters.organicOnly ? 1 : 0) +
    (filters.maxDistanceKm !== 50 ? 1 : 0) +
    (filters.minPrice !== 0 || filters.maxPrice !== 500 ? 1 : 0);

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      if (query) {
        const q = query.toLowerCase();
        const match =
          l.cropName.toLowerCase().includes(q) ||
          l.cropType.toLowerCase().includes(q) ||
          l.farmer.name.toLowerCase().includes(q) ||
          l.farmer.farmName.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.cropTypes.length && !filters.cropTypes.includes(l.cropType))
        return false;
      if (l.distanceKm > filters.maxDistanceKm) return false;
      if (l.pricePerUnit < filters.minPrice) return false;
      if (l.pricePerUnit > filters.maxPrice) return false;
      if (filters.organicOnly && !l.organic) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'nearest':
          return a.distanceKm - b.distanceKm;
        case 'cheapest':
          return a.pricePerUnit - b.pricePerUnit;
        case 'highest-rated':
          return b.qualityRating - a.qualityRating;
      }
    });

    return result;
  }, [query, filters, sort]);

  const listingBids = selected
    ? bids.filter((b) => b.listingId === selected.id)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search crops, farmers, or farm names…"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Filter */}
              <button
                onClick={() => setFilterOpen(true)}
                className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <SlidersHorizontal size={16} className="text-gray-500" />
                <span className="hidden sm:inline">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setSortOpen(false), 150)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  <span className="hidden text-gray-400 sm:inline">Sort:</span>
                  {sortOptions.find((o) => o.value === sort)?.label}
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSort(opt.value);
                          setSortOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {opt.label}
                        {sort === opt.value && (
                          <Check size={15} className="text-green-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View toggle */}
              <div className="flex overflow-hidden rounded-xl border border-gray-200">
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${
                    view === 'list'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List size={16} />
                  <span className="hidden sm:inline">List</span>
                </button>
                <button
                  onClick={() => setView('map')}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${
                    view === 'map'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Map size={16} />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filtered.length}</span>{' '}
            listings found
          </p>
        </div>

        {view === 'map' ? (
          <MapView listings={filtered} onSelect={setSelected} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                onViewDetails={(listing) => navigate(`/listing/${listing.id}`)}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <Sprout className="mx-auto mb-3 text-gray-300" size={36} />
            <p className="text-sm font-medium text-gray-500">
              No listings match your search.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setFilters(defaultFilters);
              }}
              className="mt-3 text-sm font-semibold text-green-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <DetailDrawer
          listing={selected}
          bids={listingBids}
          onClose={() => setSelected(null)}
        />
      )}

      <FilterModal
        open={filterOpen}
        filters={filters}
        onClose={() => setFilterOpen(false)}
        onApply={setFilters}
      />
    </div>
  );
}

/* ----- Map view (stylized placeholder) ----- */
function MapView({
  listings,
  onSelect,
}: {
  listings: Listing[];
  onSelect: (l: Listing) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-green-50 shadow-sm">
      <div
        className="h-[560px] w-full bg-green-100"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(34,197,94,0.12) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.1) 0, transparent 40%), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(22,163,74,0.06) 40px, rgba(22,163,74,0.06) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(22,163,74,0.06) 40px, rgba(22,163,74,0.06) 41px)',
        }}
      >
        <div className="grid h-full grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((l, i) => (
            <button
              key={l.id}
              onClick={() => onSelect(l)}
              className="group flex flex-col items-center justify-center rounded-xl bg-white/80 p-4 text-center shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md"
              style={{ marginTop: `${(i % 4) * 16}px` }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
                <Map size={18} />
              </span>
              <span className="mt-2 text-sm font-semibold text-gray-900">
                {l.cropName}
              </span>
              <span className="text-xs text-gray-400">{l.distanceKm} km</span>
            </button>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-3 py-1.5 text-xs text-gray-500 shadow-sm backdrop-blur">
        Stylized map view · connect a map provider for real geo data
      </div>
    </div>
  );
}

/* ----- Detail drawer ----- */
function DetailDrawer({
  listing,
  bids,
  onClose,
}: {
  listing: Listing;
  bids: Bid[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-lg">
        <div className="relative h-56 flex-shrink-0">
          <img
            src={listing.image}
            alt={listing.cropName}
            className="h-full w-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur hover:bg-white"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">
              {listing.cropType}
            </span>
            {listing.organic && (
              <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Organic
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6 p-6">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{listing.cropName}</h2>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">
                  ₹{listing.pricePerUnit}
                </p>
                <p className="text-xs text-gray-400">per {listing.unit}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={listing.qualityRating} showValue size={16} />
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-500">
                {listing.quantityAvailable.toLocaleString()} {listing.unit} available
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {listing.description}
            </p>
          </div>

          {/* Farmer card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
            <div className="flex items-center gap-3">
              <img
                src={listing.farmer.avatar}
                alt={listing.farmer.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-gray-900">{listing.farmer.name}</p>
                  {listing.farmer.verified && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{listing.farmer.farmName}</p>
              </div>
              <div className="text-right">
                <StarRating rating={listing.farmer.rating} size={12} />
                <p className="mt-0.5 text-xs text-gray-400">
                  {listing.farmer.totalListings} listings
                </p>
              </div>
            </div>
          </div>

          {/* Bid feed */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Gavel size={16} className="text-green-600" />
              <h3 className="text-sm font-bold text-gray-900">Recent bids on this crop</h3>
            </div>
            <BidFeed bids={bids} />
          </div>

          {/* Order status timeline */}
          <StatusTimeline events={orderTimeline} />

          {/* CTA */}
          <div className="flex gap-3">
            <button className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700">
              Place a Bid
            </button>
            <button className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
