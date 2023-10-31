import { CreateComplaintDto, UpdateComplaintDto } from '@/dtos/complaints.dto';
import Complaint from '@/models/complaints.model';
import { ComplaintsService } from '@/services/complaints.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class ComplaintsController {
  public complaintsService = Container.get(ComplaintsService);

  public getComplaints = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const complaints: Complaint[] = await this.complaintsService.findAllComplaints();

      res.status(200).json(complaints);
    } catch (error) {
      next(error);
    }
  };

  public getComplaintById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const complaint: Complaint = await this.complaintsService.findComplaintById(id);

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

  public getComplaintsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const complaints: Complaint[] = await this.complaintsService.findComplaintByUserId(userId);

      res.status(200).json(complaints);
    } catch (error) {
      next(error);
    }
  };
}
