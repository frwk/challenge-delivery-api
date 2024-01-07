import { AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import restoreSequelizeAttributesOnClass from '@models/helpers/restoreAttributes';
import { VehicleEnum } from '@/enums/vehicle.enum';
import { DataTypes } from 'sequelize';
import { DeliveryUrgencyEnum } from '@/enums/delivery-urgency.enum';

@Table({ tableName: 'pricings', underscored: true })
export default class Pricings extends Model {
  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this);
  }

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataTypes.ENUM(VehicleEnum.MOTO, VehicleEnum.CAR, VehicleEnum.TRUCK))
  vehicle: VehicleEnum;

  @Column(DataTypes.ENUM(DeliveryUrgencyEnum.NORMAL, DeliveryUrgencyEnum.URGENT, DeliveryUrgencyEnum.DIRECT))
  urgency: DeliveryUrgencyEnum;

  @Column
  units: number;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  static get fixedRate(): number {
    return 1.085;
  }

  static get distanceRate(): number {
    return 4;
  }

  static get minimumCost(): number {
    return 5;
  }
}
