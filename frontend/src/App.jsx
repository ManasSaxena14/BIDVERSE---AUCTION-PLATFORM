import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ItemProvider } from './context/ItemContext';
import { BidProvider } from './context/BidContext';
import { ToastProvider } from './context/ToastContext';
import { ReviewProvider } from './context/ReviewContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <ItemProvider>
          <BidProvider>
            <ReviewProvider>
              <ToastProvider>
                <div className="min-h-screen bg-[#0D0D0D]">
                  <Navbar />
                  <Routes>

                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/items/:id" element={<ItemDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/auction/:id" element={<ViewAuctionDetails />} />
                  <Route path="/category/:categoryName" element={<CategoryItems />} />


                  <Route
                    path="/create-item"
                    element={
                      <ProtectedRoute roles={['auctioneer', 'superadmin']}>
                        <CreateItem />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/update-item/:id"
                    element={
                      <ProtectedRoute>
                        <UpdateItem />
                      </ProtectedRoute>
                    }
                  />


                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute roles={['bidder', 'auctioneer', 'superadmin']}>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-profile"
                    element={
                      <ProtectedRoute roles={['bidder', 'auctioneer', 'superadmin']}>
                        <EditProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-auctions"
                    element={
                      <ProtectedRoute roles={['auctioneer', 'superadmin']}>
                        <ViewMyAuctions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/place-bid/:id"
                    element={
                      <ProtectedRoute roles={['bidder', 'superadmin']}>
                        <PlaceBid />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/update-bid/:id"
                    element={
                      <ProtectedRoute>
                        <UpdateBid />
                      </ProtectedRoute>
                    }
                  />


                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                          <p className="text-gray-600 mb-4">Page not found</p>
                          <a href="/" className="btn btn-primary">
                            Go to Home
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
                <Footer />
                <Toast />
              </div>
              </ToastProvider>
            </ReviewProvider>
          </BidProvider>
        </ItemProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;