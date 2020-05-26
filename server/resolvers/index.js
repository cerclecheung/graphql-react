import { GraphQLDateTime } from 'graphql-iso-date';
import userResolvers from './user';
import transctionResolvers from './transaction';
const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  transctionResolvers,
];
