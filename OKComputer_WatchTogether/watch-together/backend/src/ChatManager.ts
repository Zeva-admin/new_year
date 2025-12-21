import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatData } from './types';

export class ChatManager {
  private messages: Map<string, ChatMessage[]> = new Map();

  addMessage(data: ChatData): ChatMessage {
    const message: ChatMessage = {
      id: uuidv4(),
      userId: data.userId,
      username: data.username || 'Anonymous',
      message: data.message,
      timestamp: new Date(),
      roomId: data.roomId
    };

    if (!this.messages.has(data.roomId)) {
      this.messages.set(data.roomId, []);
    }

    const roomMessages = this.messages.get(data.roomId)!;
    roomMessages.push(message);

    if (roomMessages.length > 100) {
      roomMessages.shift();
    }

    return message;
  }

  getMessages(roomId: string, limit: number = 50): ChatMessage[] {
    const roomMessages = this.messages.get(roomId) || [];
    return roomMessages.slice(-limit);
  }

  clearMessages(roomId: string): void {
    this.messages.delete(roomId);
  }
}