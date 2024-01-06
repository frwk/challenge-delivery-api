import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import User from '@/models/users.model';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';
import 'dotenv/config';
import Courier from '@/models/couriers.model';
import { LoginUserDto, SignupDto } from '@/dtos/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import Delivery from '@/models/deliveries.model';

export class DeliveryTrackingController {
  public auth = Container.get(AuthService);
  public deliveryTrackingClientsMap = new Map<string, any>();
  public deliveryId: number;

  private static instance: DeliveryTrackingController;

  public static getInstance(): DeliveryTrackingController {
    if (!DeliveryTrackingController.instance) {
      DeliveryTrackingController.instance = new DeliveryTrackingController();
    }
    return DeliveryTrackingController.instance;
  }

  public handleLocationMessage = async (ws, message: any, user: User) => {
    this.deliveryTrackingClientsMap.forEach((client, wsId) => {
      const clientWs = this.deliveryTrackingClientsMap.get(wsId);
      if (clientWs && client.userInfo.role == 'client') {
        clientWs.ws.send(JSON.stringify({ type: 'location', data: message }));
      }
    });
  };

  private messageDispatcher = {
    location: this.handleLocationMessage,
  };

  private handleWsMessage = (ws: any, data?: string, user?: User) => {
    try {
      const parsedMessage = JSON.parse(data);
      const messageType = parsedMessage.type;

      if (this.messageDispatcher.hasOwnProperty(messageType)) {
        this.messageDispatcher[messageType](ws, parsedMessage, user);
      } else {
        console.warn('Unknown message type:', messageType);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  public handleDeliveryTracking = async (ws, req: RequestWithUser) => {
    const deliveryId = Number(req.params.deliveryId);
    const wsId = uuidv4();
    const userInfo = req.user;
    ws.send(JSON.stringify({ type: 'join', data: { wsId, userInfo, deliveryId } }));
    this.deliveryTrackingClientsMap.set(wsId, { ws, userInfo, deliveryId });
    console.log(`Delivery tracking client ${wsId} connected`);
    ws.on('message', (message: string) => {
      this.handleWsMessage(ws, message, userInfo);
    });
    ws.on('close', () => {
      this.deliveryTrackingClientsMap.delete(wsId);
    });
  };

  public sendDeliveryUpdate = async (updatedDelivery: Delivery) => {
    const deliveryWithCourier = await Delivery.findByPk(updatedDelivery.id, {
      include: { model: Courier, include: [{ model: User, attributes: ['id', 'email', 'firstName', 'lastName'] }] },
    });
    this.deliveryTrackingClientsMap.forEach((client, wsId) => {
      if (updatedDelivery.id === client.deliveryId) {
        try {
          client.ws.send(
            JSON.stringify({
              type: 'deliveryUpdate',
              data: deliveryWithCourier,
            }),
          );
          console.log(`Delivery update sent to client ${wsId}`);
        } catch (error) {
          console.error(`Error sending delivery update to client ${wsId}:`, error);
        }
      }
    });
  };
}
