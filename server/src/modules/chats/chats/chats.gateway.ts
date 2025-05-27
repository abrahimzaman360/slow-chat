import { forwardRef, Inject } from '@nestjs/common';
import { CreateMessageDto } from '../../messages/dto/create-message.dto';
import { MessagesService } from '../../messages/messages/messages.service';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  transports: ['websocket'],
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // JOIN chat room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() chatId: string, client: Socket) {
    client.join(chatId);
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }

  // SEND message
  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() dto: CreateMessageDto) {
    const savedMessage = await this.messagesService.sendMessage(dto);
    this.server.to(dto.chatId).emit('newMessage', savedMessage); // send to chat room
  }
}
