import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model } from 'sequelize-typescript';
import User from './users.model';
import Delivery from './deliveries.model';

@Table({ tableName: 'notations' })
export default class Notation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  note: number;

  @ForeignKey(() => Delivery)
  @Column
  deliveryId: number;

  @BelongsTo(() => Delivery)
  delivery: Delivery;

  @ForeignKey(() => User)
  @Column
  clientId: number;

  @BelongsTo(() => User)
  client: User;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;
}
