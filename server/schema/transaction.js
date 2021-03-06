import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    transactions: [Transaction!]!
    portfolioPage(limit: Int): PortfolioAndUser!
  }
  extend type Mutation {
    createTransaction(symbol: String!, quantity: Int!): Transaction!
  }

  type Transaction {
    id: ID!
    symbol: String!
    price: Float!
    quantity: Int!
    user: User!
    createdAt: Date!
  }
  type PortfolioAndUser {
    portfolio: [Stock!]
    user: User!
    currentValue: Float!
  }
  type Stock {
    symbol: String!
    totalQuantity: Int!
    value: Float!
    color: String!
  }
`;
