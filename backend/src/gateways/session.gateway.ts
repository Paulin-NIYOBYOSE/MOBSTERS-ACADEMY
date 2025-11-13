import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

interface ChatPayload {
  sessionId: number;
  message: string;
}

interface JoinPayload {
  sessionId: number;
}

@WebSocketGateway({
  cors: { origin: 'http://localhost:8080', credentials: true },
  namespace: '/ws/sessions',
})
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track which session a socket joined
  private socketSession = new Map<string, { sessionId: number; user: any }>();

  async handleConnection(client: Socket) {
    try {
      // simple auth using access token from query or headers
      const token = (client.handshake.auth && (client.handshake.auth as any).token)
        || (client.handshake.headers['authorization'] as string | undefined)?.replace('Bearer ', '')
        || (client.handshake.query['token'] as string | undefined);

      if (!token) {
        client.disconnect(true);
        return;
      }

      // verify token (best to use same secret as JWT strategy)
      const secret = process.env.JWT_SECRET || 'secret';
      const decoded = jwt.verify(token, secret) as any;
      (client.data as any).user = { id: decoded.sub, email: decoded.email, name: decoded.name };
    } catch {
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    // On disconnect, notify room participants and cleanup mapping
    const info = this.socketSession.get(client.id);
    if (info) {
      const room = `session:${info.sessionId}`;
      client.to(room).emit('participant_left', { user: info.user });
      this.socketSession.delete(client.id);
    }
  }

  @SubscribeMessage('join_session')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: JoinPayload) {
    const room = `session:${payload.sessionId}`;
    client.join(room);
    this.socketSession.set(client.id, { sessionId: payload.sessionId, user: (client.data as any).user });
    // notify others about presence
    client.to(room).emit('participant_joined', { user: (client.data as any).user });
    return { status: 'ok' };
  }

  @SubscribeMessage('leave_session')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() payload: JoinPayload) {
    const room = `session:${payload.sessionId}`;
    client.leave(room);
    client.to(room).emit('participant_left', { user: (client.data as any).user });
    this.socketSession.delete(client.id);
    return { status: 'ok' };
  }

  @SubscribeMessage('chat_message')
  handleChat(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatPayload) {
    const room = `session:${payload.sessionId}`;
    const user = (client.data as any).user;
    const message = {
      id: Date.now().toString(),
      userId: user?.id,
      userName: user?.name || user?.email || 'User',
      message: payload.message,
      timestamp: new Date().toISOString(),
    };
    this.server.to(room).emit('chat_message', message);
    return { status: 'ok' };
  }
}
