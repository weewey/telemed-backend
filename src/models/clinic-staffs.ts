import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";
// eslint-disable-next-line import/no-cycle
import Clinic from "./clinic";
// eslint-disable-next-line import/no-cycle

@Table({ tableName: "ClinicStaffs" })

export default class ClinicStaffs extends Model {
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

  @ForeignKey(() => Clinic)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public clinicId?: number;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
