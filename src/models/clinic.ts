import { Column, CreatedAt, DataType, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
// eslint-disable-next-line import/no-cycle
import Queue from "./queue";

export interface ClinicAttributes {
  name: string,
  imageUrl: string,
  lat: number,
  long: number,
  address: string,
  postalCode: string,
  email: string,
  phoneNumber: string,
}

@Table({ tableName: "Clinics" })

export default class Clinic extends Model {
  @Column({ allowNull: false, primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
  public id!: number;

  @Column({
    type: DataType.CHAR,
    allowNull: false,
  })
  public name!: string;

  @Column({
    type: DataType.CHAR,
    allowNull: true,
    validate: { isUrl: { msg: "Invalid imageUrl" } },
  })
  public imageUrl!: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    validate: { isNumeric: true, min: -90, max: 90 },
  })
  public lat!: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
    validate: { isNumeric: true, min: -180, max: 180 },
  })
  public long!: number;

  @Column({
    type: DataType.CHAR,
    allowNull: false,
  })
  public address!: string;

  @Column({
    type: DataType.CHAR,
    allowNull: false,
  })
  public postalCode!: string;

  @Column({
    type: DataType.CHAR,
    allowNull: false,
    validate: { isEmail: { msg: "Invalid email" } },
  })
  public email!: string;

  @Column({
    type: DataType.CHAR,
    allowNull: false,
  })
  public phoneNumber!: string;

  @HasMany(() => Queue)
  public queues!: Queue[];

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
