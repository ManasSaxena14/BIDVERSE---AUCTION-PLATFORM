import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ItemProvider } from './context/ItemContext';
import { BidProvider } from './context/BidContext';
import { ToastProvider } from './context/ToastContext';
import { ReviewProvider } from './context/ReviewContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ItemDetails from './pages/ItemDetails';
import CreateItem from './pages/CreateItem';
import UpdateItem from './pages/UpdateItem';
import PlaceBid from './pages/PlaceBid';
import UpdateBid from './pages/UpdateBid';
import About from './pages/About';
import Leaderboard from './pages/Leaderboard';
import Categories from './pages/Categories';
import CategoryItems from './pages/CategoryItems';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import ViewAuctionDetails from './pages/ViewAuctionDetails';
import ViewMyAuctions from './pages/ViewMyAuctions';
import AdminDashboard from './pages/AdminDashboard';
import HowItWorks from './pages/HowItWorks';

import { Home as HomeIcon } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-deep">
    <div className="text-center">
      <h1 className="text-7xl font-black gradient-text-gold font-display mb-4">404</h1>
      <p className="text-text-secondary mb-6">The page you're looking for doesn't exist</p>
      <Link to="/" className="btn-gold inline-flex">
        <HomeIcon className="w-4 h-4" /> Go Home
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <ItemProvider>
            <BidProvider>
              <ReviewProvider>
                <ToastProvider>
                  <div className="min-h-screen bg-bg-deep relative">
                    <div className="ambient-glow" />
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/items/:id" element={<ItemDetails />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/how-it-works" element={<HowItWorks />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/auction/:id" element={<ViewAuctionDetails />} />
                      <Route path="/category/:categoryName" element={<CategoryItems />} />

                      <Route path="/create-item" element={<ProtectedRoute roles={['auctioneer', 'superadmin']}><CreateItem /></ProtectedRoute>} />
                      <Route path="/update-item/:id" element={<ProtectedRoute><UpdateItem /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute roles={['bidder', 'auctioneer', 'superadmin']}><UserProfile /></ProtectedRoute>} />
                      <Route path="/edit-profile" element={<ProtectedRoute roles={['bidder', 'auctioneer', 'superadmin']}><EditProfile /></ProtectedRoute>} />
                      <Route path="/my-auctions" element={<ProtectedRoute roles={['auctioneer', 'superadmin']}><ViewMyAuctions /></ProtectedRoute>} />
                      <Route path="/place-bid/:id" element={<ProtectedRoute roles={['bidder', 'superadmin']}><PlaceBid /></ProtectedRoute>} />
                      <Route path="/update-bid/:id" element={<ProtectedRoute><UpdateBid /></ProtectedRoute>} />
                      <Route path="/admin-dashboard" element={<ProtectedRoute roles={['superadmin']}><AdminDashboard /></ProtectedRoute>} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                    <Toast />
                    <Chatbot />
                  </div>
                </ToastProvider>
              </ReviewProvider>
            </BidProvider>
          </ItemProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;