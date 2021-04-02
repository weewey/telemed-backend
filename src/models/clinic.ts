import {Table, Column, Model, DataType, CreatedAt, UpdatedAt} from 'sequelize-typescript'

@Table({tableName: "Clinics"})

export default class Clinic extends Model<Clinic> {

    @Column({allowNull: false, primaryKey: true, type: DataType.INTEGER})
    public id!: number;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
    })
    public address!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false
    })
    public postalCode!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false
    })
    public phoneNumber!: string;

    @CreatedAt
    public createdAt!: Date;

    @UpdatedAt
    public updatedAt!: Date;

}