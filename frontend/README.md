# 🎯 Auction Platform Frontend

A modern, responsive frontend for an auction platform built with React, Vite, Tailwind CSS, and Context API for state management.

## ✨ Features

### User Interface
- 🎨 Luxury auction house design with gold accents
- 📱 Fully responsive layout for all devices
- ⚡ Lightning-fast performance with Vite
- 🌙 Dark theme optimized for auction browsing

### Core Functionality
- 🔐 User authentication (Signup/Login)
- 🏷️ Auction browsing with categories
- 💰 Real-time bidding system
- ⭐ Review system for completed auctions
- 📊 Leaderboard for top bidders
- 🔍 Advanced search and filtering

### State Management
- 📦 Context API for global state
- 🔄 Custom hooks for data fetching
- 🍞 Toast notifications for user feedback
- 🔒 Protected routes based on user roles

## 📁 Project Structure

```
frontend/
├── public/                   # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── BidList.jsx       # Bid display component
│   │   ├── ItemCard.jsx      # Auction item card
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── Footer.jsx        # Footer component
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   ├── Toast.jsx         # Notification component
│   │   └── ReviewForm.jsx    # Review submission form
│   ├── context/              # Global state management
│   │   ├── AuthContext.jsx   # Authentication state
│   │   ├── ItemContext.jsx   # Auction item state
│   │   ├── BidContext.jsx    # Bid state
│   │   ├── ToastContext.jsx  # Notification state
│   │   └── ReviewContext.jsx # Review state
│   ├── pages/                # Page components
│   │   ├── Home.jsx          # Homepage
│   │   ├── ItemDetails.jsx   # Auction item details
│   │   ├── CreateItem.jsx    # Create auction form
│   │   ├── UpdateItem.jsx    # Update auction form
│   │   ├── PlaceBid.jsx      # Place bid form
│   │   ├── UpdateBid.jsx     # Update bid form
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Signup page
│   │   ├── UserProfile.jsx   # User profile
│   │   ├── EditProfile.jsx   # Edit profile
│   │   ├── Categories.jsx    # Categories page
│   │   ├── CategoryItems.jsx # Items by category
│   │   ├── Leaderboard.jsx   # Top bidders
│   │   ├── About.jsx         # About page
│   │   ├── ViewMyAuctions.jsx # My auctions
│   │   └── ViewAuctionDetails.jsx # Auction details view
│   ├── services/             # API service functions
│   │   ├── api.js            # Axios instance
│   │   └── index.js          # Service exports
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── .gitignore                # Git ignore rules
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── vite.config.js            # Vite configuration
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Step 1: Navigate to frontend directory
```bash
cd frontend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start the development server
```bash
npm run dev
```

Frontend will run on: **http://localhost:3000**

### Step 4: Build for production
```bash
npm run build
```

### Step 5: Preview production build
```bash
npm run preview
```

## 🎨 UI Components

### Navigation
- Responsive navbar with mobile menu
- Role-based navigation links
- User profile dropdown

### Auction Cards
- Beautiful card design with image preview
- Real-time bid information
- Category tags and status indicators
- Action buttons based on user role

### Bidding System
- Intuitive bid placement form
- Real-time bid updates
- Bid history display
- Leaderboard for top bidders

### Notifications
- Toast notifications for user feedback
- Success, error, warning, and info variants
- Auto-dismissal with manual close option

## 🛠️ Environment Configuration

The frontend uses Vite's proxy feature to communicate with the backend:

```javascript
// vite.config.js
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:6001',
      changeOrigin: true
    }
  }
}
```

Ensure the backend is running on `http://localhost:6001` or update the proxy target accordingly.

## 🎯 User Roles & Interface

### Bidder Interface
- Browse all auction items
- Place bids on active auctions
- View bid history
- Leave reviews on completed auctions
- Manage personal profile

### Auctioneer Interface
- Create new auction items
- Manage own auctions
- View bids on own items
- Edit auction details
- Manage personal profile

### Superadmin Interface
- Full access to all features
- Manage all auctions and bids
- User administration
- System oversight

## 🎨 Styling & Design

### Color Palette
- Primary: `#D4AF37` (Gold)
- Background: `#0D0D0D` (Dark)
- Text: `#F7F7F7` (Light)
- Secondary: `#E5E4E2` (Silver)
- Accent: `#1A1A1A` (Charcoal)

### Typography
- Primary Font: System UI fonts
- Headings: Bold and tracking-wide
- Body Text: Clean and readable

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🧪 Testing the Application

### User Flows

1. **Bidder Journey**
   - Sign up as bidder
   - Browse auctions
   - Place bids
   - Win auction
   - Leave review

2. **Auctioneer Journey**
   - Sign up as auctioneer
   - Create auction
   - Monitor bids
   - Close auction
   - View feedback

3. **Superadmin Journey**
   - Manually created in database
   - Oversee all auctions
   - Manage users
   - Handle disputes

## 🐛 Troubleshooting

### Common Issues

1. **Blank Screen**
   - Check browser console for errors
   - Ensure backend is running
   - Verify API connection

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token validity
   - Verify backend authentication

3. **Styling Problems**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS rules
   - Verify responsive breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 📞 Support

For support, email [your-email@example.com] or open an issue in the repository.