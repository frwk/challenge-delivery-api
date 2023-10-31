import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model, HasMany, Default } from 'sequelize-typescript';
import User from './users.model';
import Delivery from './deliveries.model';
import ComplaintMessage from './complaint-message.model';
import { ComplaintStatuses } from '@/enums/complaint-statuses.enum';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'complaints', underscored: true })
export default class Complaint extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Delivery)
  @Column
  deliveryId: number;

  @BelongsTo(() => Delivery)
  delivery: Delivery;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Default(ComplaintStatuses.PENDING)
  @Column(DataTypes.ENUM(ComplaintStatuses.PENDING, ComplaintStatuses.RESOLVED))
  status: ComplaintStatuses;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @HasMany(() => ComplaintMessage)
  complaintMessages: ComplaintMessage[];
}
