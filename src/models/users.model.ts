import {
  AutoIncrement,
  Column,
  CreatedAt,
  HasMany,
  PrimaryKey,
  Table,
  UpdatedAt,
  Model,
  DataType,
  Default,
  Unique,
  DeletedAt,
  BeforeCreate,
  BeforeUpdate,
  BeforeBulkCreate,
  BeforeBulkUpdate,
} from 'sequelize-typescript';
import Delivery from './deliveries.model';
import { Roles } from '@/enums/roles.enum';
import Complaint from './complaints.model';
import Reward from './rewards.model';
import { hash } from 'bcryptjs';

@Table({ tableName: 'users', underscored: true })
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Default(Roles.CLIENT)
  @Column(DataType.ENUM(Roles.CLIENT, Roles.COURIER, Roles.ADMIN, Roles.SUPPORT))
  role: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => Delivery)
  deliveries: Delivery[];

  @HasMany(() => Complaint)
  complaints: Complaint[];

  @HasMany(() => Reward)
  rewards: Reward[];

  @BeforeCreate
  @BeforeUpdate
  @BeforeBulkCreate
  @BeforeBulkUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      instance.password = await hash(instance.password, 10);
    }
  }
}
