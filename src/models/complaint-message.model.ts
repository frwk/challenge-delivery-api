import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model } from 'sequelize-typescript';
import User from './users.model';
import Complaint from './complaints.model';
import restoreSequelizeAttributesOnClass from './helpers/restoreAttributes';

@Table({ tableName: 'complaint_messages', underscored: true })
export default class ComplaintMessage extends Model {
  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this);
  }

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
  complaint: ReturnType<() => Complaint>;

  @BelongsTo(() => User)
  user: ReturnType<() => User>;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;
}
