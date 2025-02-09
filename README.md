# Double Act

A multiplayer word association game where players try to match pairs of actors who have appeared in movies together.

## Features

- Single player and multiplayer modes
- Multiple deck types with different difficulty levels
- Real-time analytics tracking
- Admin dashboard for monitoring game statistics
- Google Analytics 4 integration

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/double-act.git
cd double-act
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
npm run dev
```

5. Open `http://localhost:3001` in your browser

## Analytics

The game includes two types of analytics:

1. **Google Analytics 4**
   - Real-time player tracking
   - Game mode preferences
   - Answer statistics
   - Player engagement metrics

2. **Admin Dashboard** (Access with Ctrl+Alt+S)
   - Game session monitoring
   - Player statistics
   - Deck popularity
   - Answer performance tracking

## Tech Stack

- Frontend: Vanilla JavaScript, Chart.js
- Backend: Node.js, Express
- Database: MongoDB
- Analytics: Google Analytics 4

## License

MIT
