import path from 'path';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models, { db } from './db';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import http from 'http';

const app = express();

const typeDefs = schema;
// start listening (and create a 'server' object representing our server)
const getMe = async (req) => {
  const tokenWithBearer = req.headers['authorization'];
  const token = tokenWithBearer
    ? tokenWithBearer.split(' ')[1]
    : null;
  console.log('token', !!token, token, tokenWithBearer);
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      console.log('here');
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};
const apolloServer = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        return { models };
      }
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.SECRET,
      };
    },
  });
  server.applyMiddleware({ app });
  return server;
};

const createApp = () => {
  app.use(cors());

  // static looks for matching file in public folder
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
  });
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res
      .status(err.status || 500)
      .send(err.message || 'Internal server error.');
  });
};

const startListening = (server) => {
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
};
const syncDb = () => db.sync();

async function bootApp() {
  await syncDb();
  const server = apolloServer();
  await createApp();
  await startListening(server);
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec

// if (require.main === module) {
//   bootApp();
// } else {
//   createApp();
// }

bootApp();
