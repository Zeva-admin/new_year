# WatchTogether - Collaborative Video Watching Platform

A real-time web application that allows users to watch videos together in perfect synchronization, no matter where they are.

## 🚀 Features

- **Real-time Video Synchronization**: Play, pause, and seek actions are instantly synchronized across all participants
- **Universal Video Support**: Works with YouTube, Vimeo, and direct video URLs (MP4, WebM, etc.)
- **Room Management**: Create private rooms with unique URLs for sharing with friends
- **Live Chat**: Communicate with other participants while watching
- **Host Controls**: Room host has full control over video playback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Modern, eye-friendly dark interface
- **User Presence**: See who's currently in the room

## 🛠 Technology Stack

### Backend
- **Node.js** with **TypeScript** - Server runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time WebSocket communication
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** with **TypeScript** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Socket.io Client** - WebSocket client
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
watch-together/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Main server file
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── RoomManager.ts    # Room management logic
│   │   └── ChatManager.ts    # Chat message management
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── store.ts         # Zustand store
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # React entry point
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The backend server will start on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🎯 How It Works

### Room Creation & Joining

1. **Create Room**: Users can create a new room by providing a username and room name
2. **Generate Room ID**: The backend generates a unique UUID for each room
3. **Join Room**: Other users can join using the room ID
4. **Host Assignment**: The room creator becomes the host with video control privileges

### Video Synchronization

The application uses WebSocket connections through Socket.io for real-time communication:

1. **Host Control**: Only the host can control video playback (play, pause, seek)
2. **State Broadcasting**: When the host performs an action, the state is broadcast to all participants
3. **Client Synchronization**: Participants' video players automatically sync to the host's state
4. **Smooth Playback**: The system minimizes latency for seamless synchronized viewing

### Message Flow

```
Host Action → Socket.io Event → Server Broadcast → All Clients Update
```

## 🔧 Core Components

### VideoPlayer Component
- Handles video playback and controls
- Manages synchronization with room state
- Provides UI for host controls
- Supports multiple video formats

### Chat Component
- Real-time messaging system
- User avatars and timestamps
- Message history persistence
- Auto-scroll to latest messages

### RoomManager (Backend)
- Manages room lifecycle
- Handles user join/leave events
- Maintains room state
- Host transfer logic

### Store (Zustand)
- Global state management
- Socket.io integration
- Real-time updates
- User and room state

## 🎨 Design System

The application uses a consistent dark theme with:
- **Primary Color**: Blue (#3b82f6)
- **Background**: Dark slate (#0f172a, #1e293b)
- **Text**: Light slate (#f8fafc, #f1f5f9)
- **Cards**: Dark components with subtle borders
- **Animations**: Smooth transitions and hover effects

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Flexible layouts using CSS Grid and Flexbox
- Adaptive video player
- Collapsible sidebar on mobile
- Touch-friendly controls

## 🔒 Security Considerations

- CORS configuration for production
- Environment variable management
- Input validation and sanitization
- Secure WebSocket connections
- No sensitive data exposure

## 🚀 Deployment

### Backend Deployment
1. Build the project: `npm run build`
2. Set production environment variables
3. Deploy to cloud provider (Heroku, Vercel, AWS, etc.)
4. Ensure WebSocket support is enabled

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy static files to CDN or hosting service
3. Configure API URL environment variable
4. Enable HTTPS for WebSocket connections

## 🔄 Future Enhancements

- **Authentication System**: User accounts and profiles
- **Video Queue**: Playlist management for multiple videos
- **Screen Sharing**: Share screen content
- **Voice Chat**: Audio communication integration
- **Recording**: Session recording capabilities
- **Mobile Apps**: Native iOS and Android applications
- **Analytics**: Usage tracking and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ by the WatchTogether Team