import { RequestWithUser } from '@/interfaces/auth.interface';
import { Routes } from '@/interfaces/routes.interface';
import { AuthWsMiddleware } from '@/middlewares/auth.middleware';
import ComplaintMessage from '@/models/complaint-message.model';
import Complaint from '@/models/complaints.model';
import User from '@/models/users.model';
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

export class WsRoute implements Routes {
  public path = '/ws';
  public router = Router();
  public clientsMap = new Map<string, any>();

  constructor() {
    // TODO: Remove this timeout (it doesn't work without it - seems like "expressWs" is not initialized yet)
    setTimeout(() => {
      this.initializeRoutes();
    }, 1000);
  }

  private sendMessageToUser(wsId: string, data: any) {
    const client = this.clientsMap.get(wsId);
    if (client) {
      client.ws.send(JSON.stringify(data));
    } else {
      console.warn(`wsId ${wsId} not found`);
    }
  }

  private handleChatMessage = async (ws: any, data: any, user: User) => {
    let whereClause: { id: number; userId?: number };
    if (['admin', 'support'].includes(user.role)) {
      whereClause = { id: data.complaintId };
    } else {
      whereClause = { id: data.complaintId, userId: user.id };
    }
    const complaint = await Complaint.findOne({
      where: whereClause,
      attributes: ['id', 'status'],
    });
    if (!complaint) return ws.send(JSON.stringify({ type: 'error', data: 'Complaint not found' }));
    if (complaint.status === 'resolved') return ws.send(JSON.stringify({ type: 'error', data: 'Complaint is resolved' }));

    const response = {
      type: 'chat',
      data: {
        ...data,
      },
    };
    ComplaintMessage.create({ ...data })
      .then(() => {
        this.clientsMap.forEach((client, wsId) => {
          if (['admin', 'support'].includes(client.userInfo.role) || client.userInfo.id === data.userId) {
            this.sendMessageToUser(wsId, response);
          }
        });
        return;
      })
      .catch(error => {
        return console.error('Error creating complaint message:', error);
      });
  };

  private handleJoinMessage = async (ws: any, data: any, user: User) => {
    let whereClause: { id: number; userId?: number };
    if (['admin', 'support'].includes(user.role)) {
      whereClause = { id: data.complaintId };
    } else {
      whereClause = { id: data.complaintId, userId: user.id };
    }
    const complaint = await Complaint.findOne({
      where: whereClause,
      include: [
        {
          model: ComplaintMessage,
          attributes: ['id', 'content', 'createdAt'],
          include: [{ model: User, attributes: ['id', 'role'] }],
          separate: true,
          order: [['createdAt', 'ASC']],
        },
      ],
    });
    if (!complaint) return ws.send(JSON.stringify({ type: 'error', data: 'Complaint not found' }));

    const properMessages = complaint.complaintMessages.map(message => ({
      content: message.content,
      date: message.createdAt,
      userType: message.user.role,
    }));
    return ws.send(JSON.stringify({ type: 'join', data: properMessages }));
  };

  private handlePingMessage = (ws: any) => {
    const response = { type: 'pong' };
    ws.send(JSON.stringify(response));
  };

  private messageDispatcher = {
    chat: this.handleChatMessage,
    join: this.handleJoinMessage,
    ping: this.handlePingMessage,
  };

  private handleWsMessage = (ws: any, data?: string, user?: User) => {
    try {
      const parsedMessage = JSON.parse(data);
      const messageType = parsedMessage.type;

      if (this.messageDispatcher.hasOwnProperty(messageType)) {
        this.messageDispatcher[messageType](ws, parsedMessage.data, user);
      } else {
        console.warn('Unknown message type:', messageType);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  private initializeRoutes() {
    this.router.ws('/', AuthWsMiddleware, (ws, req: RequestWithUser) => {
      const wsId = uuidv4();
      const userInfo = req.user;
      this.clientsMap.set(wsId, { ws, userInfo });
      ws.on('message', (message: string) => {
        this.handleWsMessage(ws, message, userInfo);
      });
      ws.on('close', () => {
        this.clientsMap.delete(wsId);
      });
    });
  }
}
