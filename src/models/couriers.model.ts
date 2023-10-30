import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model } from 'sequelize-typescript';
import User from './users.model';

@Table({ tableName: 'couriers', underscored: true })
export default class Courier extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  isAvailable: boolean;

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
