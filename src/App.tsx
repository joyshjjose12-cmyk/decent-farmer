import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/pages/LandingPage';
import MarketplacePage from '@/pages/MarketplacePage';
import ListingDetailPage from '@/pages/ListingDetailPage';
import FarmerDashboardPage from '@/pages/FarmerDashboardPage';
import CreateEditListingPage from '@/pages/CreateEditListingPage';
import OrderTrackingPage from '@/pages/OrderTrackingPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/listing/new" element={<CreateEditListingPage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/listing/:id/edit" element={<CreateEditListingPage />} />
            <Route path="/dashboard" element={<FarmerDashboardPage />} />
            <Route path="/order/:id" element={<OrderTrackingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
