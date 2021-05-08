import {Column, CreatedAt, DataType, ForeignKey, HasMany, Model, Table, UpdatedAt} from 'sequelize-typescript'
import Clinic from "./clinic";
import QueueStatus from "../queue_status";
import Doctor from "./doctor";

export interface QueueAttributes {
    clinicId: number
    status: string
    waitingTicketsCount: number
    waitingTicketsId: Array<number> 
    closedTicketsId: Array<number> 
    latestGeneratedTicketDisplayNumber: number
    startedAt?: Date
    closedAt?: Date
}

export interface QueueAttributesWithId extends QueueAttributes {
    id: number
}

@Table({tableName: "Queues"})

export default class Queue extends Model {

    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    public id!: number;

    @ForeignKey(() => Clinic)
    @Column
    public clinicId!: number;

    @Column({
        type: DataType.ENUM(),
        values: [QueueStatus.ACTIVE, QueueStatus.INACTIVE, QueueStatus.CLOSED],
        allowNull: false
    })
    public status!: string;

    @Column({
        type: DataType.DATE(),
        allowNull: true,
    })
    public startedAt!: Date;

    @Column({
        type: DataType.DATE(),
        allowNull: true,
    })
    public closedAt!: Date;

    @Column({
        type: DataType.INTEGER(),
        allowNull: false,
        defaultValue: 0,
    })
    public waitingTicketsCount?: number;

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false,
        defaultValue: [],
    })
    public waitingTicketsId?: Array<number> ;

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false,
        defaultValue: [],
    })
    public closedTicketsId?: Array<number> ;

    @Column({
        type: DataType.INTEGER(),
        allowNull: true,
    })
    public latestGeneratedTicketDisplayNumber?: number

    @HasMany(() => Doctor)
    public doctors?: Doctor[];

    @CreatedAt
    public readonly createdAt!: Date;

    @UpdatedAt
    public readonly updatedAt!: Date;

}