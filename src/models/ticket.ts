/* eslint-disable import/no-cycle */
import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import Clinic from "./clinic";
import Queue from "./queue";
import Patient from "./patient";
import TicketStatus from "../ticket_status";
import TicketTypes from "../ticket_types";

export interface TicketAttributes {
  patientId: number,
  status: TicketStatus,
  queueId: number,
  displayNumber: number,
  clinicId: number,
  type: TicketTypes,
  zoomMeetingId?: string,
  zoomStartMeetingUrl?: string,
  zoomJoinMeetingUrl?: string
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

  @Column({
    type: DataType.ENUM(),
    values: [ TicketTypes.PHYSICAL, TicketTypes.TELEMED ],
    allowNull: false,
  })
  public type!: string;

  @ForeignKey(() => Queue)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public queueId!: number;

  @BelongsTo(() => Queue)
  public queue!: Queue;

  @ForeignKey(() => Clinic)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public clinicId!: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public zoomMeetingId?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public zoomStartMeetingUrl?: string|null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public zoomJoinMeetingUrl?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public zoomPassword?: string;

  @CreatedAt
  public createdAt!: Date;

  @UpdatedAt
  public updatedAt!: Date;
}
