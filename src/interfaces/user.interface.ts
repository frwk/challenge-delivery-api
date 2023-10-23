import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // L'association HasMany sera définie plus tard
  public getDeliveries!: HasMany<Delivery>;
}
