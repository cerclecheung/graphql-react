import { GraphQLDateTime } from 'graphql-iso-date';
import userResolvers from './user';
import messageResolvers from './message';
import transctionResolvers from './transaction';
const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  transctionResolvers,
];
