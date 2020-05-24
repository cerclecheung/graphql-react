import Sequelize from 'sequelize';
const pkg = require('../../package.json');

const databaseName =
  pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '');
console.log('DB name', databaseName, process.env.NODE_ENV);

export const db = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://localhost:5432/${databaseName}`,
  //   process.env.DATABASE,
  //   process.env.DATABASE_USER,
  //   process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close());
}