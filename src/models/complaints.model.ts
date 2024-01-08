import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  PrimaryKey,
  Table,
  UpdatedAt,
  Model,
  HasMany,
  Default,
  DeletedAt,
  Unique,
} from 'sequelize-typescript';
import User from './users.model';
import Delivery from './deliveries.model';
import ComplaintMessage from './complaint-message.model';
import { ComplaintStatuses } from '@/enums/complaint-statuses.enum';
import { DataTypes } from 'sequelize';
import restoreSequelizeAttributesOnClass from './helpers/restoreAttributes';

@Table({ tableName: 'complaints', underscored: true })
export default class Complaint extends Model {
  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this);
  }

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Delivery)
  @Unique
  @Column
  deliveryId: number;

  @BelongsTo(() => Delivery)
  delivery: ReturnType<() => Delivery>;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Default(ComplaintStatuses.PENDING)
  @Column(DataTypes.ENUM(ComplaintStatuses.PENDING, ComplaintStatuses.RESOLVED))
  status: ComplaintStatuses;

  @BelongsTo(() => User)
  user: ReturnType<() => User>;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => ComplaintMessage, 'complaintId')
  complaintMessages: ComplaintMessage[];
}
