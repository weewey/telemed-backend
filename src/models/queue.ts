/* eslint-disable import/no-cycle */
import { Column, CreatedAt, DataType, ForeignKey, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import Clinic from "./clinic";
import QueueStatus from "../queue_status";
import Doctor from "./doctor";
import Ticket from "./ticket";

export interface QueueAttributes {
  clinicId: number
  status?: string
  latestGeneratedTicketDisplayNumber?: number
  pendingTicketIdsOrder?: Array<number>
  currentTicketId?: number| null
  startedAt?: Date
  closedAt?: Date | null
}

export interface QueueAttributesWithId extends QueueAttributes {
  id: number
}

@Table({ tableName: "Queues" })

export default class Queue extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  public id!: number;

  @ForeignKey(() => Clinic)
  @Column
  public clinicId!: number;

  @Column({
    type: DataType.ENUM(),
    values: [ QueueStatus.ACTIVE, QueueStatus.INACTIVE, QueueStatus.CLOSED ],
    allowNull: false,
  })
  public status!: string;

  @Column({
    type: DataType.DATE(),
    allowNull: true,
  })
  public startedAt?: Date;

  @Column({
    type: DataType.DATE(),
    allowNull: true,
  })
  public closedAt?: Date;

  @ForeignKey(() => Clinic)
  @Column
  public currentTicketId!: number;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
    defaultValue: [],
  })
  public pendingTicketIdsOrder!: Array<number> ;

  @Column({
    type: DataType.INTEGER(),
    defaultValue: 0,
  })
  public latestGeneratedTicketDisplayNumber!: number;

  @HasMany(() => Ticket)
  public tickets!: Ticket[];

  @HasMany(() => Doctor)
  public doctors!: Doctor[];

  @CreatedAt
  public readonly createdAt!: Date;

  @UpdatedAt
  public readonly updatedAt!: Date;
}
