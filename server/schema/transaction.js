import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    transactions(cursor: String, limit: Int): TransactionConnection!
    portfolio(limit: Int): [Stock!]
  }
  extend type Mutation {
    createTransaction(symbol: String!, quantity: Int!): Transaction!
  }

  # for pagination
  type TransactionConnection {
    edges: [Transaction!]!
    transactionPageInfo: TransactionPageInfo!
  }

  type TransactionPageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Transaction {
    id: ID!
    symbol: String!
    price: Float!
    quantity: Int!
    user: User!
    createdAt: Date!
  }
  type Stock {
    symbol: String!
    # price: Float!
    totalQuantity: Int!
    value: Float!
    # user: User!
  }
  # extend type Subscription {
  #   messageCreated: MessageCreated!
  # }

  # type MessageCreated {
  #   message: Message!
  # }
`;
