export interface User {
  id: string;
  username: string;
  avatar?: string;
  isHost: boolean;
  socketId: string;
  joinedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  users: Map<string, User>;
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

export interface RoomSettings {
  name: string;
  isPublic: boolean;
  maxUsers?: number;
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

export interface ChatData {
  roomId: string;
  message: string;
  userId: string;
}