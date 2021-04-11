import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey} from 'sequelize-typescript'
import Clinic from "./clinic";
import QueueStatus from "../queue_status";

export interface QueueAttributes {
    clinicId: number
    status: string
    startedAt?: Date
    closedAt?: Date
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

    @CreatedAt
    public readonly createdAt!: Date;

    @UpdatedAt
    public readonly updatedAt!: Date;

}