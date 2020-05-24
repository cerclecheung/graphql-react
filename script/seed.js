'use strict';

// const { db } = require('../server/models');
// const models = require('../server/models');

import { db } from '../server/db';
import models from '../server/db';

const { User, Message, Transaction } = models;

async function seed(date) {
  await db.sync({ force: true });
  console.log('db synced!');

  const users = await Promise.all([
    User.create(
      {
        username: 'rwieruch',
        email: 'hello@robin.com',
        password: 'rwieruch',
        role: 'admin',
        messages: [
          {
            text: 'Published the Road to learn React',
            // createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
      },
      {
        include: [Message],
      },
    ),
    User.create(
      {
        username: 'ddavids',
        email: 'hello@david.com',
        password: 'ddavids',
        messages: [
          {
            text: 'Happy to release ...',
            // createdAt: date.setSeconds(date.getSeconds() + 1),
          },
          {
            text: 'Published a complete ...',
            // createdAt: date.setSeconds(date.getSeconds() + 1),
          },
        ],
      },
      {
        include: [Message],
      },
    ),
  ]);
  const transactions = await Promise.all([
    Transaction.create({
      symbol: 'FB',
      quantity: 1,
      userId: 1,
      price: '15.0',
    }),
    Transaction.create({
      symbol: 'FB',
      quantity: 20,
      userId: 1,
      price: '15.0',
    }),
  ]);

  console.log(`seeded ${users.length} users`);

  console.log(`seeded ${transactions.length} transactions`);
  console.log(`seeded successfully`);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed(new Date());
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
