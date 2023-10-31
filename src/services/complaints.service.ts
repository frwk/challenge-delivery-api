import { CreateComplaintDto, UpdateComplaintDto } from '@/dtos/complaints.dto';
import { HttpException } from '@/exceptions/HttpException';
import Complaint from '@/models/complaints.model';
import { Service } from 'typedi';

@Service()
export class ComplaintsService {
  public async findAllComplaints(): Promise<Complaint[]> {
    const allComplaints: Complaint[] = await Complaint.findAll();
    return allComplaints;
  }

  public async findComplaintById(complaintId: number): Promise<Complaint> {
    const findComplaint: Complaint = await Complaint.findByPk(complaintId);
    if (!findComplaint) throw new HttpException(404, "Complaint doesn't exist");

    return findComplaint;
  }

  public async createComplaint(complaintData: CreateComplaintDto): Promise<Complaint> {
    const createComplaintData: Complaint = await Complaint.create({ ...complaintData });
    return createComplaintData;
  }

  public async updateComplaint(complaintId: number, complaintData: UpdateComplaintDto): Promise<Complaint> {
    const findComplaint: Complaint = await Complaint.findByPk(complaintId);
    if (!findComplaint) throw new HttpException(404, "Complaint doesn't exist");

    await Complaint.update({ ...complaintData }, { where: { id: complaintId } });

    const updateComplaint: Complaint = await Complaint.findByPk(complaintId);
    return updateComplaint;
  }

  public async findComplaintByUserId(userId: number): Promise<Complaint[]> {
    const findComplaints: Complaint[] = await Complaint.findAll({ where: { userId } });
    return findComplaints;
  }
}
