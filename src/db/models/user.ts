import {
  Table,
  Column,
  Model,
  CreatedAt,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';
import { DataTypeUUIDv4 } from 'sequelize';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: DataTypeUUIDv4;

  @Column({ unique: true, allowNull: false })
  username!: string;

  @Column({ unique: true, allowNull: false })
  email!: string;

  @Column({ allowNull: false })
  password!: string;

  @Column({
    type: DataType.ENUM('member', 'admin'),
    defaultValue: 'member',
    allowNull: false,
  })
  role!: string;

  @CreatedAt
  @Column({ defaultValue: DataType.NOW, allowNull: false })
  createdAt!: Date;
}
