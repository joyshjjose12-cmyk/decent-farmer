import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Gavel,
  CheckCircle,
  Plus,
  LayoutDashboard,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import ListingTableRow from '@/components/ListingTableRow';
import { dashboardStats, dashboardListings } from '@/data/mockData';
import type { DashboardListing, ListingStatus } from '@/types';

export default function FarmerDashboardPage() {
  const [listings, setListings] = useState<DashboardListing[]>(dashboardListings);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const handleMarkSold = (listing: DashboardListing) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listing.id
          ? { ...l, status: 'Sold' as ListingStatus, quantityAvailable: 0 }
          : l
      )
    );
    setToast(`${listing.cropName} marked as sold.`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleViewBids = (listing: DashboardListing) => {
    setToast(`${listing.bidsCount} bids on ${listing.cropName}.`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleEdit = (listing: DashboardListing) => {
    navigate(`/listing/${listing.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
              <LayoutDashboard size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
              <p className="text-sm text-gray-500">
                Manage your listings, bids, and sales
              </p>
            </div>
          </div>
          <Link
            to="/listing/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
          >
            <Plus size={18} />
            New Listing
          </Link>
        </div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Active Listings"
            value={dashboardStats.activeListings}
            icon={<Package size={22} />}
            accent="green"
            sublabel="Currently accepting bids"
          />
          <StatCard
            label="Pending Bids"
            value={dashboardStats.pendingBids}
            icon={<Gavel size={22} />}
            accent="amber"
            sublabel="Awaiting your review"
          />
          <StatCard
            label="Completed Sales"
            value={dashboardStats.completedSales}
            icon={<CheckCircle size={22} />}
            accent="blue"
            sublabel={`₹${dashboardStats.totalRevenue.toLocaleString('en-IN')} total revenue`}
          />
        </div>

        {/* Listings table */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">My Listings</h2>
            <span className="text-sm text-gray-400">{listings.length} total</span>
          </div>

          {/* Desktop header */}
          <div className="mb-3 hidden items-center gap-4 border-b border-gray-50 px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 sm:flex">
            <span className="flex-1">Crop</span>
            <span className="w-28 text-center">Quantity</span>
            <span className="w-24 text-center">Price</span>
            <span className="w-20 text-center">Bids</span>
            <span className="w-24 text-center">Status</span>
            <span className="w-44 text-right">Actions</span>
          </div>

          <div className="space-y-3">
            {listings.map((listing) => (
              <ListingTableRow
                key={listing.id}
                listing={listing}
                onViewBids={handleViewBids}
                onEdit={handleEdit}
                onMarkSold={handleMarkSold}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
