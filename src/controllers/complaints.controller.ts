import { CreateComplaintDto, UpdateComplaintDto } from '@/dtos/complaints.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Complaint from '@/models/complaints.model';
import Courier from '@/models/couriers.model';
import Delivery from '@/models/deliveries.model';
import User from '@/models/users.model';
import { ComplaintsService } from '@/services/complaints.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class ComplaintsController {
  public complaintsService = Container.get(ComplaintsService);

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
        ],
      });

      res.status(200).json(complaints);
    } catch (error) {
      next(error);
    }
  };
}
