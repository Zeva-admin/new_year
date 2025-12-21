import { v4 as uuidv4 } from 'uuid';
import { Room, User, RoomSettings, CreateRoomData, JoinRoomData } from './types';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  createRoom(data: CreateRoomData, socketId: string): Room {
    const roomId = uuidv4();
    const userId = uuidv4();
    
    const host: User = {
      id: userId,
      username: data.username,
      isHost: true,
      socketId,
      joinedAt: new Date()
    };

    const room: Room = {
      id: roomId,
      name: data.roomName,
      hostId: userId,
      users: new Map([[userId, host]]),
      videoUrl: data.videoUrl,
      currentTime: 0,
      isPlaying: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(data: JoinRoomData, socketId: string): { room: Room; user: User } | null {
    const room = this.rooms.get(data.roomId);
    if (!room) return null;

    const userId = uuidv4();
    const user: User = {
      id: userId,
      username: data.username,
      isHost: false,
      socketId,
      joinedAt: new Date()
    };

    room.users.set(userId, user);
    room.updatedAt = new Date();

    return { room, user };
  }

  leaveRoom(roomId: string, userId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.users.delete(userId);
    
    if (room.users.size === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    if (room.hostId === userId) {
      const newHost = room.users.values().next().value;
      if (newHost) {
        room.hostId = newHost.id;
        newHost.isHost = true;
      }
    }

    room.updatedAt = new Date();
    return room;
  }

  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  updateVideoState(roomId: string, currentTime: number, isPlaying: boolean): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.currentTime = currentTime;
    room.isPlaying = isPlaying;
    room.updatedAt = new Date();
    
    return true;
  }

  setVideoUrl(roomId: string, videoUrl: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    room.videoUrl = videoUrl;
    room.currentTime = 0;
    room.isPlaying = false;
    room.updatedAt = new Date();
    
    return true;
  }

  getUserBySocketId(socketId: string): { room: Room; user: User } | null {
    for (const room of this.rooms.values()) {
      for (const user of room.users.values()) {
        if (user.socketId === socketId) {
          return { room, user };
        }
      }
    }
    return null;
  }
}