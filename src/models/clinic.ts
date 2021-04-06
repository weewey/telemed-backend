import {Table, Column, Model, DataType, CreatedAt, UpdatedAt} from 'sequelize-typescript'

@Table({tableName: "Clinics"})

export default class Clinic extends Model<Clinic> {

    @Column({allowNull: false, primaryKey: true, type: DataType.INTEGER})
    public id!: number;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
    })
    public name!: string;

    @Column({
        type: DataType.CHAR,
        allowNull: true,
    })
    public imageUrl!: string;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    public lat!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: true,
    })
    public long!: number;

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
    public email!: string;

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