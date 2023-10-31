import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model } from 'sequelize-typescript';
import User from './users.model';
import Complaint from './complaints.model';

@Table({ tableName: 'complaint_messages', underscored: true })
export default class ComplaintMessage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Complaint)
  @Column
  complaintId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  content: string;

  @BelongsTo(() => Complaint)
  complaint: Complaint;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;
}
