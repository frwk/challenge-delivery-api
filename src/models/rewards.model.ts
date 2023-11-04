import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model, DeletedAt } from 'sequelize-typescript';
import User from './users.model';

@Table({ tableName: 'rewards', underscored: true })
export default class Reward extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

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
}