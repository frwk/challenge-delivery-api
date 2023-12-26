import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { ComplaintsController } from '@/controllers/complaints.controller';
import { CreateComplaintDto, UpdateComplaintDto } from '@/dtos/complaints.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class ComplaintRoute implements Routes {
  public path = '/complaints';
  public router = Router();
  public complaintsController = new ComplaintsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.complaintsController.getComplaints);
    this.router.get(`${this.path}/:id(\\d+)`, this.complaintsController.getComplaintById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateComplaintDto), this.complaintsController.createComplaint);
    this.router.patch(`${this.path}/:id(\\d+)`, ValidationMiddleware(UpdateComplaintDto, true), this.complaintsController.updateComplaint);
    this.router.patch(`${this.path}/:id(\\d+)/resolved`, AuthMiddleware(), this.complaintsController.resolveComplaint);
    this.router.get(`${this.path}/user/:userId(\\d+)`, AuthMiddleware(), this.complaintsController.getComplaintsByUserId);
  }
}
