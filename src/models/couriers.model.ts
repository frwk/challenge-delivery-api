import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model, DataType } from 'sequelize-typescript';
import User from './users.model';
import { VehicleCategories } from '@/enums/vehicle-categories.enum';

@Table({ tableName: 'couriers' })
export default class Courier extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  isAvailable: string;

  @Column(DataType.ENUM(VehicleCategories.BIKE, VehicleCategories.CAR))
  vehicleCategory: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;
}
