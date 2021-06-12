import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "Admins" })

export default class Admin extends Model {
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

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
