import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import User from '@/models/users.model';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@/exceptions/HttpException';
import 'dotenv/config';
import Courier from '@/models/couriers.model';
import CourierMongo from '@/database/mongo/models/Courier';
import { LoginUserDto, SignupDto } from '@/dtos/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import Delivery from '@/models/deliveries.model';
import { Roles } from '@/enums/roles.enum';

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
      if (clientWs && client.userInfo.role != Roles.COURIER) {
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
    const delivery = await Delivery.findByPk(deliveryId, {
      attributes: ['clientId', 'courierId'],
    });
    if (!delivery) throw new HttpException(404, 'Delivery not found');
    if (userInfo.role !== Roles.ADMIN && userInfo.role !== Roles.SUPPORT) {
      if (userInfo.role === Roles.CLIENT && userInfo.id !== delivery.clientId) {
        return ws.close(1008, 'Access denied');
      }
      if (delivery.courierId) {
        const courier = await Courier.findByPk(delivery.courierId, {
          attributes: ['userId'],
        });
        if (!courier) throw new HttpException(404, 'Courier not found');
        if (userInfo.role === Roles.COURIER && userInfo.id !== courier.userId) {
          return ws.close(1008, 'Access denied');
        }
      }
    }
    ws.send(JSON.stringify({ type: 'join', data: { wsId, userInfo, deliveryId } }));
    this.deliveryTrackingClientsMap.set(wsId, { ws, userInfo, deliveryId });
    console.log(`Delivery tracking client ${wsId} connected`);
    ws.on('message', async (message: string) => {
      this.handleWsMessage(ws, message, userInfo);
      try {
        const parsedMessage = JSON.parse(message);
        const messageType = parsedMessage.type;
        if (messageType === 'location') {
          const courrierId = parsedMessage.courierId;
          const coordinates = parsedMessage.coordinates;
          await CourierMongo.updateOne({ _id: courrierId }, { latitude: coordinates[0], longitude: coordinates[1] });
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    ws.on('close', () => {
      console.log(`Delivery tracking client ${wsId} disconnected`);
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
