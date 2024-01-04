import { CreateComplaintDto, UpdateComplaintDto } from '@/dtos/complaints.dto';
import { HttpException } from '@/exceptions/HttpException';
import Complaint from '@/models/complaints.model';
import { Attributes, FindOptions } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class ComplaintsService {
  public async findAllComplaints(options: FindOptions<Attributes<Complaint>>): Promise<Complaint[]> {
    const allComplaints: Complaint[] = await Complaint.findAll(options);
    return allComplaints;
  }

  public async findOneComplaint(options: FindOptions<Attributes<Complaint>>): Promise<Complaint> {
    const complaint: Complaint = await Complaint.findOne(options);
    if (!complaint) throw new HttpException(404, "Complaint doesn't exist");

    return complaint;
  }

  public async findComplaintById(complaintId: number, options: FindOptions<Attributes<Complaint>>): Promise<Complaint> {
    const findComplaint: Complaint = await Complaint.findByPk(complaintId, options);
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

  public async resolveComplaint(complaintId: number, userId: number, options: FindOptions<Attributes<Complaint>>): Promise<Complaint> {
    const findComplaint: Complaint = await Complaint.findOne({ where: { id: complaintId, userId } });
    if (!findComplaint) throw new HttpException(404, "Complaint doesn't exist");

    await Complaint.update({ status: 'resolved' }, { where: { id: complaintId } });

    const updateComplaint: Complaint = await Complaint.findByPk(complaintId, options);
    return updateComplaint;
  }

  public async findComplaintByUserId(userId: number, options: FindOptions<Attributes<Complaint>>): Promise<Complaint[]> {
    const findComplaints: Complaint[] = await Complaint.findAll({ ...options, where: { userId } });
    return findComplaints;
  }
}
