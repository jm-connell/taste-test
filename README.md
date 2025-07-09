# Taste Test: Spotify Listening Analytics

Taste Test is a web application that provides detailed analytics about your Spotify listening habits and offers a social feed to track your friends' musical journeys.

## Features

### Listening Analytics

The home page offers several analytical insights about your Spotify listening habits:

- **Recently Played Tracks**: Displays your 10 most recently played songs with track name, artist, and timestamp
- **Average Song Popularity**: Analyzes the global popularity of your 25 most-listened tracks, giving insight into whether your music taste trends mainstream or underground
- **Top Artist Analysis**: Identifies which artist you've listened to most frequently in your recent listening history (~200 tracks), showing play count and first listen date

### Friend Feed

The Friend Feed page displays a social timeline of your friends' listening activity:

- View what friends are listening to
- See statistics about their listening habits
- Track how their music preferences evolve over time

## Technology Stack

- **Frontend**: React (with functional components and hooks)
- **Authentication**: Spotify OAuth via Supabase
- **Routing**: React Router
- **Styling**: Custom CSS
- **API Integration**: Spotify Web API

## Getting Started

### Prerequisites

- Node.js and npm
- A Spotify account
- A Supabase account with Spotify OAuth configured

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Sign in with your Spotify account
2. Explore your listening analytics on the Home page
3. View friend activity on the Friend Feed page
4. Use the "Refresh Data" button to get the latest information
5. If your connection to Spotify expires, use the "Reconnect to Spotify" button

## Project Structure

- `/src/components`: UI components
- `/src/pages`: Page components
- `/src/context`: Context providers
- `/src/services`: API service functions

## Future Enhancements

- Real-time friend activity integration
- More detailed listening statistics
- Customizable time ranges for analytics
- Music recommendation engine based on listening patterns
- Enhanced social features like comments and reactions

## License

This project is part of a senior project at BYU-Idaho by Jon Connell.
