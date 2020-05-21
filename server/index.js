import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models from './models';
import cors from 'cors';
const app = express();

app.use(cors());

const typeDefs = schema;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    me: models.users[1],
  },
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(
    'Now browse to http://localhost:4000' + server.graphqlPath,
  ),
);
