import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey} from 'sequelize-typescript'
import Clinic from "./clinic";
import QueueStatus from "../queue_status";

@Table({tableName: "Queues"})

export default class Queue extends Model<Queue> {

    @Column({
        allowNull: false,
        primaryKey: true,
        type: DataType.INTEGER
    })
    public id!: number;

    @ForeignKey(() => Clinic)
    @Column
    public clinicId!: number;

    @Column({
        type: DataType.ENUM(),
        values: [QueueStatus.NOT_STARTED, QueueStatus.ACTIVE, QueueStatus.PAUSED, QueueStatus.CLOSED],
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
    public createdAt!: Date;

    @UpdatedAt
    public updatedAt!: Date;

}