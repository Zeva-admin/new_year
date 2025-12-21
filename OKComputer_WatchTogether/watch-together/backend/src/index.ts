import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { RoomManager } from './RoomManager';
import { ChatManager } from './ChatManager';
import { CreateRoomData, JoinRoomData, VideoSyncData, ChatData } from './types';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const roomManager = new RoomManager();
const chatManager = new ChatManager();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'WatchTogether Backend API',
    version: '1.0.0',
    status: 'running',
    rooms: roomManager.getAllRooms().length
  });
});

app.get('/api/rooms', (req, res) => {
  const rooms = roomManager.getAllRooms().map(room => ({
    id: room.id,
    name: room.name,
    userCount: room.users.size,
    videoUrl: room.videoUrl,
    isPlaying: room.isPlaying,
    createdAt: room.createdAt
  }));
  res.json(rooms);
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = roomManager.getRoom(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({
    id: room.id,
    name: room.name,
    userCount: room.users.size,
    videoUrl: room.videoUrl,
    currentTime: room.currentTime,
    isPlaying: room.isPlaying,
    users: Array.from(room.users.values()).map(user => ({
      id: user.id,
      username: user.username,
      isHost: user.isHost,
      joinedAt: user.joinedAt
    }))
  });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('create-room', (data: CreateRoomData) => {
    try {
      const room = roomManager.createRoom(data, socket.id);
      socket.join(room.id);
      
      socket.emit('room-created', {
        room: {
          id: room.id,
          name: room.name,
          hostId: room.hostId,
          videoUrl: room.videoUrl,
          currentTime: room.currentTime,
          isPlaying: room.isPlaying
        },
        user: room.users.values().next().value
      });

      console.log(`Room created: ${room.id} by ${data.username}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to create room' });
    }
  });

  socket.on('join-room', (data: JoinRoomData) => {
    try {
      const result = roomManager.joinRoom(data, socket.id);
      if (!result) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      const { room, user } = result;
      socket.join(room.id);

      socket.to(room.id).emit('user-joined', {
        user: {
          id: user.id,
          username: user.username,
          isHost: user.isHost,
          joinedAt: user.joinedAt
        }
      });

      socket.emit('room-joined', {
        room: {
          id: room.id,
          name: room.name,
          hostId: room.hostId,
          videoUrl: room.videoUrl,
          currentTime: room.currentTime,
          isPlaying: room.isPlaying,
          users: Array.from(room.users.values()).map(u => ({
            id: u.id,
            username: u.username,
            isHost: u.isHost,
            joinedAt: u.joinedAt
          }))
        },
        user
      });

      const recentMessages = chatManager.getMessages(room.id, 20);
      socket.emit('chat-history', { messages: recentMessages });

      console.log(`User ${user.username} joined room: ${room.id}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  socket.on('video-sync', (data: VideoSyncData) => {
    try {
      const result = roomManager.getUserBySocketId(socket.id);
      if (!result) return;

      const { room, user } = result;
      
      if (user.isHost || room.hostId === user.id) {
        roomManager.updateVideoState(data.roomId, data.currentTime, data.isPlaying);
        
        socket.to(data.roomId).emit('video-state-changed', {
          currentTime: data.currentTime,
          isPlaying: data.isPlaying,
          userId: user.id
        });
      }
    } catch (error) {
      console.error('Video sync error:', error);
    }
  });

  socket.on('set-video', (data: { roomId: string; videoUrl: string }) => {
    try {
      const result = roomManager.getUserBySocketId(socket.id);
      if (!result) return;

      const { room, user } = result;
      
      if (user.isHost || room.hostId === user.id) {
        const success = roomManager.setVideoUrl(data.roomId, data.videoUrl);
        if (success) {
          io.to(data.roomId).emit('video-changed', {
            videoUrl: data.videoUrl,
            currentTime: 0,
            isPlaying: false,
            userId: user.id
          });
        }
      }
    } catch (error) {
      console.error('Set video error:', error);
    }
  });

  socket.on('chat-message', (data: ChatData) => {
    try {
      const result = roomManager.getUserBySocketId(socket.id);
      if (!result) return;

      const { user } = result;
      const message = chatManager.addMessage({
        ...data,
        username: user.username
      });

      io.to(data.roomId).emit('chat-message', message);
    } catch (error) {
      console.error('Chat message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const result = roomManager.getUserBySocketId(socket.id);
    if (result) {
      const { room, user } = result;
      const updatedRoom = roomManager.leaveRoom(room.id, user.id);
      
      if (updatedRoom) {
        socket.to(room.id).emit('user-left', {
          userId: user.id,
          username: user.username,
          newHostId: updatedRoom.hostId !== user.id ? updatedRoom.hostId : null
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 WatchTogether Backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
});