import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    me: User
  }
  type User {
    username: String!
  }
`;

const resolvers = {
  Query: {
    me: () => {
      return { username: 'Rsssbin Wieruch' };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(
    'Now browse to http://localhost:4000' + server.graphqlPath,
  ),
);
