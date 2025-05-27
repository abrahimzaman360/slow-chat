import { CreateMessageDto } from '../../dto/create-message.dto';
import { MessagesService } from '../messages.service';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'message',
  transports: ['websocket'],
  cors: { origin: '*' },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, Socket>();


  constructor(
    private readonly messagesService: MessagesService,
  ) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.disconnect();
      return;
    }
    this.activeUsers.set(userId, client);
    console.log(`User connected: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.activeUsers.entries()]
      .find(([_, socket]) => socket.id === client.id)?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    }
  }

  // Client sends message payload here
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: any) {
    /*
      Expected payload shape:
      {
        chatId: string;
        senderId: string;
        content: string;
        type?: 'text' | 'image' | 'video' | 'audio' | 'file';
      }
    */

    // Save message to DB
    const message = await this.messagesService.createMessage(payload);

    // Emit to all participants in chat who are online
    // For simplicity, assuming messagesService can get participants of the chat
    const chatParticipants = await this.messagesService.getChatParticipants(payload.chatId);

    chatParticipants.forEach((participantId) => {
      const socket = this.activeUsers.get(participantId.toString());
      if (socket) {
        socket.emit('newMessage', message);
      }
    });

    // Optionally emit ack to sender
    client.emit('messageSent', message);
  }
}
