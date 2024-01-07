import { CreateComplaintDto, UpdateComplaintDto } from '@/dtos/complaints.dto';
import { Roles } from '@/enums/roles.enum';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import ComplaintMessage from '@/models/complaint-message.model';
import Complaint from '@/models/complaints.model';
import Courier from '@/models/couriers.model';
import Delivery from '@/models/deliveries.model';
import User from '@/models/users.model';
import { ComplaintsService } from '@/services/complaints.service';
import { DeliveryService } from '@/services/deliveries.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class ComplaintsController {
  public complaintsService = Container.get(ComplaintsService);
  public deliveryService = Container.get(DeliveryService);

  public getComplaints = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const complaints: Complaint[] = await this.complaintsService.findAllComplaints({
        attributes: ['id', 'createdAt', 'status'],
        include: [
          {
            model: Delivery,
            attributes: ['id', 'createdAt'],
            include: [
              {
                model: Courier,
                attributes: ['id'],
                include: [{ model: User, attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'], paranoid: false }],
              },
            ],
          },
          {
            model: User,
            attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'],
            paranoid: false,
          },
        ],
      });

      res.status(200).json(complaints);
    } catch (error) {
      next(error);
    }
  };

  public getComplaintById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const complaint: Complaint = await this.complaintsService.findComplaintById(id, {
        attributes: ['id', 'createdAt', 'status'],
        include: [
          {
            model: Delivery,
            attributes: [
              'id',
              'createdAt',
              'status',
              'pickupLatitude',
              'pickupLongitude',
              'dropoffLatitude',
              'dropoffLongitude',
              'pickupDate',
              'dropoffDate',
            ],
            include: [
              {
                model: Courier,
                attributes: ['id'],
                include: [{ model: User, attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'], paranoid: false }],
              },
            ],
          },
          {
            model: User,
            attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'],
            paranoid: false,
          },
        ],
      });

      res.status(200).json(complaint);
    } catch (error) {
      next(error);
    }
  };

  public createComplaint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateComplaintDto = req.body;
      const existingComplaint = await Complaint.findOne({
        where: {
          deliveryId: data.deliveryId,
          userId: data.userId,
          status: 'pending',
        },
      });
      if (existingComplaint) {
        throw new HttpException(409, 'A complaint with this deliveryId and userId already exists');
      }
      const complaint: Complaint = await this.complaintsService.createComplaint(data);

      res.status(201).json(complaint);
    } catch (error) {
      next(error);
    }
  };

  public updateComplaint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data: UpdateComplaintDto = req.body;
      const complaint: Complaint = await this.complaintsService.updateComplaint(id, data);

      res.status(200).json(complaint);
    } catch (error) {
      next(error);
    }
  };

  public resolveComplaint = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const complaint: Complaint = await this.complaintsService.resolveComplaint(id, req.user.id, {
        attributes: ['id', 'createdAt', 'status'],
        include: [
          {
            model: Delivery,
            attributes: ['id', 'createdAt'],
            include: [
              {
                model: Courier,
                attributes: ['id'],
                include: [{ model: User, attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'], paranoid: false }],
              },
            ],
          },
        ],
      });

      res.status(200).json(complaint);
    } catch (error) {
      next(error);
    }
  };

  public getComplaintsByUserId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (req.user.id !== Number(req.params.userId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const userId = Number(req.params.userId);
      const complaints: Complaint[] = await this.complaintsService.findComplaintByUserId(userId, {
        attributes: ['id', 'createdAt', 'status'],
        include: [
          {
            model: Delivery,
            attributes: ['id', 'createdAt'],
            include: [
              {
                model: Courier,
                attributes: ['id'],
                include: [{ model: User, attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'], paranoid: false }],
              },
            ],
          },
          {
            model: ComplaintMessage,
            as: 'complaintMessages',

            attributes: ['createdAt'],
          },
        ],
        order: [['complaintMessages', 'createdAt', 'DESC']],
      });

      res.status(200).json(complaints);
    } catch (error) {
      next(error);
    }
  };

  public getComplaintsByUserAndDeliveryId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const deliveryId = Number(req.params.deliveryId);
      const userId = Number(req.params.userId);
      console.log(req.user.id);
      console.log(userId);
      if (req.user.role !== Roles.ADMIN) {
        if (req.user.id !== userId) throw new HttpException(403, 'Access denied');
      }
      const complaints: Complaint[] = await this.complaintsService.findAllComplaints({
        where: { deliveryId, userId },
        attributes: ['id', 'createdAt', 'status'],
        include: [
          {
            model: Delivery,
            attributes: ['id', 'createdAt'],
            include: [
              {
                model: Courier,
                attributes: ['id'],
                include: [{ model: User, attributes: ['id', 'email', 'firstName', 'lastName', 'deletedAt'], paranoid: false }],
              },
            ],
          },
        ],
      });

      res.status(200).json(complaints);
    } catch (error) {
      next(error);
    }
  };
}
