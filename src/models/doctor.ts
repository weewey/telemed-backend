import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey, HasOne,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
// eslint-disable-next-line import/no-cycle
import Clinic from "./clinic";
// eslint-disable-next-line import/no-cycle
import Queue from "./queue";

export interface DoctorAttributesWithId extends DoctorAttributes {
  id: number
}

export interface DoctorAttributes {
  firstName: string,
  lastName: string,
  email: string,
  authId: string,
  mobileNumber: string,
  onDuty: boolean,
  dateOfBirth: string
  queueId?: number,
  clinicId?: number,
}

@Table({ tableName: "Doctors" })

export default class Doctor extends Model {
  @Column({ allowNull: false, primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
  public id!: number;

  @Column({
    type: DataType.CHAR,
    allowNull: false,
    validate: { is: /^[A-Z ]+$/i, len: [ 1, 50 ] },
  })
  public firstName!: string;

  @Column({
    type: DataType.CHAR,
    allowNull: false,
    validate: { is: /^[A-Z ]+$/i, len: [ 1, 50 ] },
  })
  public lastName!: string;

  @Unique
  @Column({
    type: DataType.CHAR,
    allowNull: false,
    validate: { isEmail: true },
  })
  public email!: string;

  @Unique
  @Column({
    type: DataType.CHAR,
    allowNull: false,
  })
  public authId!: string;

  @Unique
  @Column({
    type: DataType.CHAR,
    allowNull: false,
  })
  public mobileNumber!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public onDuty!: boolean;

  @HasOne(() => Queue)
  public queue?: Queue;

  @ForeignKey(() => Clinic)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public clinicId?: number;

  @BelongsTo(() => Clinic)
  public clinic?: Clinic;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  public dateOfBirth!: Date;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
