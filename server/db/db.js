import Sequelize from 'sequelize';
const pkg = require('../../package.json');

const databaseName =
  pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '');
console.log('DB name', databaseName, process.env.NODE_ENV);

export const db = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://localhost:5432/${databaseName}`,
  {
    dialect: 'postgres',
    ...(process.env.DATABASE_URL
      ? {
          dialectOptions: {
            ssl: true,
          },
        }
      : {}),
  },
);

if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close());
}
