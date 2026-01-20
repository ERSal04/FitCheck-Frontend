# FitCheck - Social Fashion Platform

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.76.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-~52.0.11-000020?logo=expo)

**FitCheck** is a social media platform designed for fashion enthusiasts to share their daily outfits, discover style inspiration, connect with others, and manage their virtual wardrobe. Built with React Native and Expo, FitCheck combines social networking with personal style management.

## 📱 Features

### Social Feed
- **Daily Fits**: Share your outfit of the day with the community
- **Star Rating System**: Rate other users' outfits (1-5 stars)
- **Interactive Feed**: Like, comment, and engage with fashion posts
- **Explore Page**: Discover trending outfits and styles by category

### Virtual Wardrobe
- **Digital Closet**: Organize your clothing items digitally
- **Category Management**: Organize items by Full Outfits, Tops, Bottoms, Outerwear, and Accessories
- **Photo Upload**: Add items via camera or photo library
- **Edit Mode**: Manage and delete wardrobe items

### AI Fashion Assistant
- **Personalized Recommendations**: Get outfit suggestions based on your wardrobe
- **Style Advice**: Ask fashion-related questions and receive AI-powered responses
- **Wardrobe Integration**: Toggle between general fashion advice and personalized recommendations

### User Profiles
- **Customizable Profiles**: Add bio, favorite brands, and style preferences
- **Post Grid**: Showcase your best outfits
- **Social Features**: Follow/unfollow users, view followers and following lists
- **Profile Photos**: Upload and update profile pictures

### Marketplace
- **Buy & Sell**: Browse and list fashion items for sale
- **Advanced Filters**: Search by category, price range, and more
- **Product Listings**: Create detailed product listings with images and descriptions

### Messaging
- **Direct Messages**: Communicate with other fashion enthusiasts
- **Conversation History**: Keep track of your fashion discussions

## 🛠 Tech Stack

### Frontend
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tooling
- **TypeScript/JavaScript**: Primary programming languages
- **React Navigation**: Navigation library
- **Axios**: HTTP client for API requests

### Key Libraries
- `@react-navigation/native` - Navigation
- `@react-navigation/stack` - Stack navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `expo-image-picker` - Image selection and camera access
- `expo-image` - Optimized image component
- `@react-native-async-storage/async-storage` - Local data storage
- `react-native-reanimated` - Smooth animations
- `@expo/vector-icons` - Icon library

### Backend Integration
- RESTful API integration
- JWT authentication
- Multipart form data for image uploads
- Real-time data synchronization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) (Mac only) or [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FitCheck-Frontend.git
   cd FitCheck-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API endpoint**
   
   Update the API URL in `src/lib/constants.ts`:
   ```typescript
   export const API_URL = 'your-backend-api-url';
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## 📁 Project Structure

```
FitCheck-Frontend/
├── app/                          # Expo Router app directory
│   └── (tabs)/                   # Tab-based navigation
├── assets/                       # Static assets (images, fonts)
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── AddButton.tsx
│   │   └── WardrobeListView.tsx
│   ├── lib/                     # Constants and utilities
│   │   └── constants.ts
│   ├── navigation/              # Navigation configuration
│   │   ├── AuthNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── screens/                 # Application screens
│   │   ├── auth_screens/       # Authentication screens
│   │   ├── ProfileSubScreens/  # Profile-related screens
│   │   ├── HomeScreen.tsx
│   │   ├── ExploreScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── VirtualWardrobeScreen.tsx
│   │   ├── AIChatScreen.tsx
│   │   ├── MarketScreen.tsx
│   │   └── MessagesScreen.tsx
│   ├── services/               # API services
│   │   ├── AuthService.ts
│   │   ├── ProfileService.ts
│   │   ├── PostService.ts
│   │   ├── ExploreService.ts
│   │   └── WardrobeApi.ts
│   ├── types/                  # TypeScript types and styles
│   │   └── styles/            # Style definitions
│   └── WardrobeContent/       # Wardrobe-specific components
└── package.json
```

## 🔑 Key Features Implementation

### Authentication Flow
```typescript
// Login/Signup with JWT tokens
AuthService.setToken(token);
AuthService.setUserData(userData);
```

### Virtual Wardrobe
- Multi-category organization (Full Outfit, Two Piece, Three Piece, Accessories)
- Image upload with camera or gallery
- Real-time synchronization with backend

### AI Fashion Assistant
- Context-aware fashion recommendations
- Integration with user's wardrobe data
- Real-time chat interface

### Social Features
- Post creation with image, caption, location, and category
- Like/unlike functionality
- Comment system
- Follow/unfollow users
- User profiles with follower/following counts

## 🎨 Design System

The app uses a consistent color scheme defined in `src/types/styles/colorConstants.ts`:

```typescript
const COLORS = {
  primary: '#191919',      // Dark background
  secondary: '#4C3A3A',    // Dark brown
  accent: '#FF8C05',       // Orange (primary actions)
  highlight: '#B697C7',    // Light purple
  light: '#FFFFFF',        // White text
};
```

## 🔐 Environment Variables

Create a `.env` file in the root directory (if needed for future API keys):

```env
API_URL=your_backend_url
# Add other environment variables as needed
```

## 📱 Screens Overview

| Screen | Description |
|--------|-------------|
| **Splash** | App entry point with branding |
| **Login/Signup** | Authentication screens |
| **Home** | Daily fits feed with star ratings |
| **Explore** | Discover posts by category |
| **Add Post** | Create and share outfit posts |
| **Market** | Browse and list fashion items |
| **Profile** | User profiles with post grid |
| **Virtual Wardrobe** | Manage personal clothing items |
| **AI Chat** | Fashion assistant and recommendations |
| **Messages** | Direct messaging system |

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run linter
npm run lint
```

## 📦 Build

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

## 👥 Authors

- **Elijah Salgado**
- **Brendon Mwamba**
- **Elias Murcray**
- **Nicolas Garay**

*California Baptist University - Computer Science Program*

---

**Built with ❤️ by the FitCheck Team**
