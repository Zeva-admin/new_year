# WatchTogether - Technical Architecture

## Overview

WatchTogether is a real-time collaborative video watching platform built with modern web technologies. The application enables users to create virtual rooms where they can watch videos together in perfect synchronization.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   Web Browser   │    │   Web Browser   │
│   (Frontend)    │    │   (Frontend)    │    │   (Frontend)    │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │ WebSocket            │ WebSocket            │ WebSocket
         │ Connection           │ Connection           │ Connection
         ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Socket.io Server                            │
│                   (Real-time Engine)                            │
└────────────────┬────────────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
┌─────────────────┐ ┌─────────────────┐
│  Room Manager   │ │  Chat Manager   │
│  - Room State   │ │  - Messages     │
│  - Users        │ │  - History      │
│  - Video Sync   │ │  - Broadcasting │
└─────────────────┘ └─────────────────┘
```

## Technology Stack

### Backend (Node.js + TypeScript)

**Core Technologies:**
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework for HTTP handling
- **Socket.io** - Real-time bidirectional event-based communication
- **TypeScript** - Type-safe JavaScript

**Key Libraries:**
- **uuid** - Unique identifier generation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

**Architecture Patterns:**
- **Event-Driven Architecture** - Socket.io event-based communication
- **Manager Pattern** - Separate managers for rooms and chat
- **Repository Pattern** - In-memory storage management

### Frontend (React + TypeScript)

**Core Technologies:**
- **React 18** - UI library with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

**State Management:**
- **Zustand** - Lightweight state management with React hooks
- **Socket.io Client** - Real-time communication

**Routing & Navigation:**
- **React Router v6** - Client-side routing

**UI Components:**
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## Core Components Deep Dive

### 1. Backend Architecture

#### Room Management System

```typescript
class RoomManager {
  // Manages all active rooms
  private rooms: Map<string, Room>
  
  // Core methods:
  - createRoom(): Creates new room with host
  - joinRoom(): Adds user to existing room
  - leaveRoom(): Removes user and handles host transfer
  - updateVideoState(): Synchronizes video playback
  - setVideoUrl(): Changes video source
}
```

**Room State Management:**
- Each room maintains current video state (time, playing/paused)
- User list with host identification
- Automatic host transfer when host leaves
- Room cleanup when empty

#### Real-time Communication

**Socket.io Events:**

```
Client → Server:
├── create-room (roomName, username, videoUrl?)
├── join-room (roomId, username)
├── video-sync (roomId, currentTime, isPlaying)
├── set-video (roomId, videoUrl)
└── chat-message (roomId, message)

Server → Client:
├── room-created (room, user)
├── room-joined (room, user)
├── user-joined (user)
├── user-left (userId, username)
├── video-state-changed (currentTime, isPlaying)
├── video-changed (videoUrl, currentTime, isPlaying)
├── chat-message (message)
└── chat-history (messages)
```

### 2. Frontend Architecture

#### State Management (Zustand)

```typescript
interface AppStore {
  // State
  currentUser: User | null
  currentRoom: Room | null
  isConnected: boolean
  messages: ChatMessage[]
  
  // Actions
  createRoom(data: CreateRoomData)
  joinRoom(data: JoinRoomData)
  sendChatMessage(message: string)
  syncVideo(state: VideoState)
}
```

**Key Features:**
- Automatic Socket.io integration
- Real-time state updates
- Optimistic UI updates
- Error handling and loading states

#### Component Hierarchy

```
App
├── Router
│   ├── HomePage
│   │   ├── Room Creation Form
│   │   └── Room Joining Form
│   ├── RoomPage
│   │   ├── VideoPlayer
│   │   ├── Chat
│   │   └── UserList
│   └── NotFoundPage
└── Toaster (Notifications)
```

#### Video Synchronization Algorithm

```typescript
// Host controls video
when host performs action:
  1. Update local video state
  2. Emit 'video-sync' event to server
  3. Server broadcasts to all participants
  4. Participants update their video players

// Participants receive updates
when participant receives 'video-state-changed':
  1. Compare with local state
  2. If different, update video player
  3. Smooth transition to prevent jarring
```

## Data Models

### Room Entity
```typescript
interface Room {
  id: string                    // Unique room identifier
  name: string                  // Room display name
  hostId: string               // Current host user ID
  users: Map<string, User>     // Active participants
  videoUrl?: string            // Current video source
  currentTime: number          // Video playback position
  isPlaying: boolean           // Playback state
  createdAt: Date              // Room creation timestamp
  updatedAt: Date              // Last activity timestamp
}
```

### User Entity
```typescript
interface User {
  id: string                   // Unique user identifier
  username: string             // Display name
  avatar?: string              // Profile image URL
  isHost: boolean             // Host privileges
  socketId: string            // Socket connection ID
  joinedAt: Date              // Join timestamp
}
```

### Video State
```typescript
interface VideoState {
  currentTime: number          // Current playback position
  isPlaying: boolean           // Playing or paused
  duration?: number            // Total video duration
}
```

## Real-time Synchronization Strategy

### 1. Host-Authority Model
- Only the host can control video playback
- Prevents conflicts and ensures consistency
- Host transfer handled automatically

### 2. State Broadcasting
- Host actions broadcast to all participants
- Participants cannot override host controls
- Smooth synchronization with minimal latency

### 3. Conflict Resolution
- Last-action-wins strategy
- Timestamp-based ordering
- Automatic state reconciliation

### 4. Network Resilience
- Automatic reconnection handling
- State recovery on reconnect
- Graceful degradation for poor connections

## Performance Optimizations

### 1. Frontend Optimizations

**Code Splitting:**
- Lazy loading of routes
- Component-level code splitting
- Dynamic imports for heavy components

**State Management:**
- Selective re-renders with Zustand
- Memoized components
- Optimized state updates

**Asset Optimization:**
- Compressed images and fonts
- CSS minification with Tailwind
- Tree shaking for unused code

### 2. Backend Optimizations

**Memory Management:**
- Efficient room storage with Maps
- Automatic cleanup of inactive rooms
- Optimized user tracking

**Socket.io Performance:**
- Binary data support for large messages
- Compression for text data
- Efficient event broadcasting

**Scalability Considerations:**
- Horizontal scaling with Redis adapter
- Load balancing across multiple instances
- Sticky sessions for WebSocket connections

## Security Implementation

### 1. Input Validation
- Username sanitization
- Room name validation
- URL validation for videos
- Message length limits

### 2. Access Control
- Host-only video controls
- Room membership validation
- Socket authentication
- Rate limiting on actions

### 3. Data Protection
- No sensitive data storage
- Environment variable management
- HTTPS enforcement for production
- CORS configuration

## Deployment Architecture

### Production Setup

```
┌─────────────────┐     ┌─────────────────┐
│   Cloudflare    │     │   Load Balancer │
│      CDN        │────▶│   (Nginx/HAProxy)│
└─────────────────┘     └─────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
            ┌─────────────┐─────────────┐─────────────┐
            │  Backend    │  Backend    │  Backend    │
            │  Instance 1 │  Instance 2 │  Instance 3 │
            └─────────────┘─────────────┘─────────────┘
                    │           │           │
                    └───────────┼───────────┘
                                ▼
                        ┌─────────────────┐
                        │   Redis Cluster │
                        │  (Session Store)│
                        └─────────────────┘
```

### Docker Deployment
- Multi-stage builds for optimization
- Nginx for frontend serving
- Environment-based configuration
- Health checks and restart policies

## Monitoring & Observability

### 1. Application Metrics
- Active rooms count
- Connected users
- Video sync latency
- Message throughput

### 2. Error Tracking
- Client-side error reporting
- Server exception handling
- WebSocket connection monitoring

### 3. Performance Monitoring
- Page load times
- Video buffering metrics
- API response times
- Resource utilization

## Future Enhancements

### 1. Scalability Features
- **Redis Integration**: For multi-instance communication
- **Database Persistence**: Room and user data storage
- **CDN Integration**: Global video delivery
- **Microservices**: Split into specialized services

### 2. Feature Enhancements
- **Video Queuing**: Playlist management
- **Screen Sharing**: Present content
- **Voice Chat**: Audio communication
- **Recording**: Session capture
- **Mobile Apps**: Native applications

### 3. Advanced Features
- **AI Recommendations**: Content suggestions
- **Analytics Dashboard**: Usage insights
- **Moderation Tools**: Content and user management
- **Accessibility**: Screen reader support

## Conclusion

WatchTogether demonstrates a robust real-time application architecture using modern web technologies. The system is designed for scalability, maintainability, and optimal user experience. The modular architecture allows for easy feature additions and technology updates.

Key architectural decisions:
- Event-driven real-time communication
- Centralized state management
- Component-based UI architecture
- Type-safe development with TypeScript
- Responsive and accessible design

This architecture provides a solid foundation for a production-ready collaborative video watching platform.