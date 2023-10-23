import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model } from 'sequelize-typescript';
import User from './users.model';

@Table({ tableName: 'deliveries' })
export default class Delivery extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  pickup: string;

  @Column
  dropoff: string;

  @Column
  pickup_date: Date;

  @Column
  dropoff_date: Date;

  @Column
  confirmation_code: string;

  @Column
  status: string;

  @ForeignKey(() => User)
  @Column
  clientId: number;

  @BelongsTo(() => User, 'clientId')
  client: User;

  @ForeignKey(() => User)
  @Column
  courierId: number;

  @BelongsTo(() => User, 'courierId')
  courier: User;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;
}
