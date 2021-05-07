import {BelongsTo, Column, CreatedAt, DataType, HasOne, Model, Table, Unique, UpdatedAt} from 'sequelize-typescript'
import Clinic from "./clinic";
import Queue from "./queue";

@Table({tableName: "Doctors"})

export default class Doctor extends Model {

    @Column({allowNull: false, primaryKey: true, type: DataType.INTEGER, autoIncrement: true})
    public id!: number;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
    })
    public firstName!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
    })
    public lastName!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
    })
    @Unique
    public email!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
    })
    @Unique
    public authId!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false
    })
    @Unique
    public mobileNumber!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    public onDuty!: boolean;

    @HasOne(() => Queue)
    @Column({
        allowNull: true,
        type: DataType.INTEGER
    })
    public queueId?: number;

    @BelongsTo(() => Clinic)
    @Column({
        allowNull: true,
        type: DataType.INTEGER
    })
    public clinicId?: number;

    @CreatedAt
    public createdAt!: Date;

    @UpdatedAt
    public updatedAt!: Date;

}