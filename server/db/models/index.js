import { db } from '../db';
const models = {
  User: db.import('./user'),
  Transaction: db.import('./transaction'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export default models;
