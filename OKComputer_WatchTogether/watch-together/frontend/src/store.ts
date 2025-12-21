import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { AppState, User, Room, ChatMessage, VideoState, CreateRoomData, JoinRoomData } from './types';

interface AppStore extends AppState {
  socket: Socket | null;
  messages: ChatMessage[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setCurrentRoom: (room: Room | null) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  updateRoomState: (state: Partial<Room>) => void;
  
  // Socket actions
  connectSocket: () => void;
  disconnectSocket: () => void;
  createRoom: (data: CreateRoomData) => void;
  joinRoom: (data: JoinRoomData) => void;
  sendChatMessage: (message: string) => void;
  syncVideo: (state: VideoState) => void;
  setVideoUrl: (url: string) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // State
  currentUser: null,
  currentRoom: null,
  isConnected: false,
  isLoading: false,
  error: null,
  socket: null,
  messages: [],

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setConnected: (connected) => set({ isConnected: connected }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  updateRoomState: (state) => set((prev) => ({
    currentRoom: prev.currentRoom ? { ...prev.currentRoom, ...state } : null
  })),

  // Socket actions
  connectSocket: () => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');
    
    socket.on('connect', () => {
      set({ isConnected: true, error: null });
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('Disconnected from server');
    });

    socket.on('error', (error) => {
      set({ error: error.message || 'Socket error occurred' });
    });

    socket.on('room-created', ({ room, user }) => {
      set({ 
        currentRoom: { ...room, users: [user] },
        currentUser: user,
        isLoading: false 
      });
    });

    socket.on('room-joined', ({ room, user }) => {
      set({ 
        currentRoom: room,
        currentUser: user,
        isLoading: false 
      });
    });

    socket.on('user-joined', ({ user }) => {
      set((state) => {
        if (!state.currentRoom) return state;
        const userExists = state.currentRoom.users.find(u => u.id === user.id);
        if (userExists) return state;
        
        return {
          currentRoom: {
            ...state.currentRoom,
            users: [...state.currentRoom.users, user]
          }
        };
      });
    });

    socket.on('user-left', ({ userId, username, newHostId }) => {
      set((state) => {
        if (!state.currentRoom) return state;
        
        const updatedUsers = state.currentRoom.users.filter(u => u.id !== userId);
        const updatedRoom = {
          ...state.currentRoom,
          users: updatedUsers,
          hostId: newHostId || state.currentRoom.hostId
        };

        return { currentRoom: updatedRoom };
      });
    });

    socket.on('video-state-changed', ({ currentTime, isPlaying, userId }) => {
      set((state) => {
        if (!state.currentRoom || state.currentUser?.id === userId) return state;
        
        return {
          currentRoom: {
            ...state.currentRoom,
            currentTime,
            isPlaying
          }
        };
      });
    });

    socket.on('video-changed', ({ videoUrl, currentTime, isPlaying }) => {
      set((state) => {
        if (!state.currentRoom) return state;
        
        return {
          currentRoom: {
            ...state.currentRoom,
            videoUrl,
            currentTime,
            isPlaying
          }
        };
      });
    });

    socket.on('chat-message', (message: ChatMessage) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });

    socket.on('chat-history', ({ messages }) => {
      set({ messages });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  createRoom: (data) => {
    const { socket } = get();
    if (!socket) return;
    
    set({ isLoading: true, error: null });
    socket.emit('create-room', data);
  },

  joinRoom: (data) => {
    const { socket } = get();
    if (!socket) return;
    
    set({ isLoading: true, error: null });
    socket.emit('join-room', data);
  },

  sendChatMessage: (message) => {
    const { socket, currentUser, currentRoom } = get();
    if (!socket || !currentUser || !currentRoom) return;
    
    socket.emit('chat-message', {
      roomId: currentRoom.id,
      message,
      userId: currentUser.id
    });
  },

  syncVideo: (state) => {
    const { socket, currentUser, currentRoom } = get();
    if (!socket || !currentUser || !currentRoom) return;
    
    socket.emit('video-sync', {
      roomId: currentRoom.id,
      currentTime: state.currentTime,
      isPlaying: state.isPlaying,
      userId: currentUser.id
    });
  },

  setVideoUrl: (url) => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;
    
    socket.emit('set-video', {
      roomId: currentRoom.id,
      videoUrl: url
    });
  },
}));