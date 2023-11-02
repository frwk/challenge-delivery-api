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
  Default,
  DeletedAt,
  HasMany,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import User from './users.model';
import Delivery from './deliveries.model';
import { CourierStatuses } from '@/enums/courier-statuses.enum';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'couriers', underscored: true })
export default class Courier extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Default(CourierStatuses.UNAVAILABLE)
  @Column(DataTypes.ENUM(CourierStatuses.AVAILABLE, CourierStatuses.UNAVAILABLE, CourierStatuses.ONDELIVERY))
  status: string;

  @Column({ type: 'DECIMAL(9,6)', allowNull: true })
  latitude: number;

  @Column({ type: 'DECIMAL(9,6)', allowNull: true })
  longitude: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => Delivery)
  deliveries: Delivery[];
}
