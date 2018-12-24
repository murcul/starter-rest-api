import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';

dotenv.config();

const sequelize = new Sequelize({
  database: <string>process.env.DB_NAME,
  dialect: <string>process.env.DB_DIALECT,
  host: <string>process.env.DB_HOST,
  username: <string>process.env.DB_USER,
  password: <string>process.env.DB_PASS,
});

const db: any = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
