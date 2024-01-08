import { AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt, Model, DeletedAt } from 'sequelize-typescript';
import User from './users.model';
import restoreSequelizeAttributesOnClass from './helpers/restoreAttributes';

@Table({ tableName: 'rewards', underscored: true })
export default class Reward extends Model {
  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this);
  }

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: ReturnType<() => User>;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
