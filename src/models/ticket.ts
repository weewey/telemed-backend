import { Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import Clinic from "./clinic";
import Queue from "./queue";
import Patient from "./patient";
import TicketStatus from "../ticket_status";

export interface TicketAttributes {
  patientId: number,
  status: string,
  queueId: number,
  displayNumber: number,
  clinicId: number,
}

export interface TicketAttributesWithId extends TicketAttributes {
  id: number
}

@Table({ tableName: "Tickets" })

export default class Ticket extends Model {
  @Column({ allowNull: false, primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public displayNumber!: number;

  @ForeignKey(() => Patient)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public patientId!: number;

  @Column({
    type: DataType.ENUM(),
    values: [ TicketStatus.WAITING, TicketStatus.SERVING, TicketStatus.CLOSED ],
    defaultValue: TicketStatus.WAITING,
    allowNull: false,
  })
  public status?: string;

  @ForeignKey(() => Queue)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public queueId!: number;

  @ForeignKey(() => Clinic)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public clinicId!: number;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
