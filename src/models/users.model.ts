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
  DefaultScope,
  Unique,
  DeletedAt,
  BeforeCreate,
  BeforeUpdate,
  BeforeBulkCreate,
  BeforeBulkUpdate,
  HasOne,
} from 'sequelize-typescript';
import Delivery from './deliveries.model';
import { Roles } from '@/enums/roles.enum';
import Complaint from './complaints.model';
import Reward from './rewards.model';
import { hash } from 'bcryptjs';
import restoreSequelizeAttributesOnClass from './helpers/restoreAttributes';
import Courier from './couriers.model';

@Table({ tableName: 'users', underscored: true })
@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
export default class User extends Model {
  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this);
  }

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

  @Column({ allowNull: true })
  notificationToken: string;

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

  @HasOne(() => Courier, 'user_id')
  courier: ReturnType<() => Courier>;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      instance.password = await hash(instance.password, 10);
    }
  }

  @BeforeBulkCreate
  static async hashPasswordBulk(instances: User[], options: any) {
    for (const instance of instances) {
      if (instance.changed('password')) {
        instance.password = await hash(instance.password, 10);
      }
    }
  }
}
