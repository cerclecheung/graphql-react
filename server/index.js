import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models, { db } from './models';
import cors from 'cors';
const app = express();
const createApp = () => {
  app.use(cors());
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res
      .status(err.status || 500)
      .send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  const typeDefs = schema;
  // start listening (and create a 'server' object representing our server)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => ({
      models,
      me: await models.User.findByLogin('rwieruch'),
      secret: process.env.SECRET,
    }),
  });
  server.applyMiddleware({ app });
  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
};
const syncDb = () => db.sync();
// const eraseDatabaseOnSync = true;

// db.sync({ force: eraseDatabaseOnSync }).then(async () => {
//   if (eraseDatabaseOnSync) {
//     createUsersWithMessages();
//   }
// });

async function bootApp() {
  await syncDb();
  await createApp();
  await startListening();
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp();
} else {
  createApp();
}
