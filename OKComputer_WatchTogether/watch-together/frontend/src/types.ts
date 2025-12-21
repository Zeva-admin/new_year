export interface User {
  id: string;
  username: string;
  avatar?: string;
  isHost: boolean;
  joinedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  users: User[];
  videoUrl?: string;
  currentTime: number;
  isPlaying: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  roomId: string;
}

export interface VideoState {
  currentTime: number;
  isPlaying: boolean;
  duration?: number;
}

export interface CreateRoomData {
  roomName: string;
  username: string;
  videoUrl?: string;
}

export interface JoinRoomData {
  roomId: string;
  username: string;
}

export interface VideoSyncData {
  roomId: string;
  currentTime: number;
  isPlaying: boolean;
  userId: string;
}

export interface AppState {
  currentUser: User | null;
  currentRoom: Room | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}