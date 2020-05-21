import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models, { db } from './models';
import cors from 'cors';
const app = express();

app.use(cors());

const typeDefs = schema;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    me: models.User.findByLogin('rwieruch'),
  },
});

server.applyMiddleware({ app });
const eraseDatabaseOnSync = true;

db.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
