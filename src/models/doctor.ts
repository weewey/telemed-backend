import {BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, Unique, UpdatedAt} from 'sequelize-typescript'
import Clinic from "./clinic";
import Queue from "./queue";

export interface DoctorAttributes {
    firstName: string,
    lastName: string,
    email: string,
    authId: string,
    mobileNumber: string,
    onDuty: boolean,
    queueId?: number,
    clinicId?: number,
}

@Table({tableName: "Doctors"})

export default class Doctor extends Model {

    @Column({allowNull: false, primaryKey: true, type: DataType.INTEGER, autoIncrement: true})
    public id!: number;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
        validate: {is: /^[A-Z ]+$/i, len: [1, 50]}
    })
    public firstName!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
        validate: {is: /^[A-Z ]+$/i, len: [1, 50]},
    })
    public lastName!: string;

    @Unique
    @Column({
        type: DataType.CHAR,
        allowNull: false,
        validate: {isEmail: true}
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
        allowNull: false
    })
    public mobileNumber!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    public onDuty!: boolean;

    @ForeignKey(() => Queue)
    @Column({
        allowNull: true,
        type: DataType.INTEGER,
    })
    public queueId?: number;

    @BelongsTo(() => Queue)
    public queue?: Queue;

    @ForeignKey(() => Clinic)
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