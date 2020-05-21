import Sequelize from 'sequelize';
const pkg = require('../../package.json');

const databaseName =
  pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '');

const db = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://localhost:5432/${databaseName}`,
  //   process.env.DATABASE,
  //   process.env.DATABASE_USER,
  //   process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

const models = {
  User: db.import('./user'),
  Message: db.import('./message'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { db };
export default models;
