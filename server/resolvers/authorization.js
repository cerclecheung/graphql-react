import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === 'admin'
      ? skip
      : new ForbiddenError('Not authorized as admin.'),
);

export const isTransactionOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const transaction = await models.Transaction.findByPk(id, {
    raw: true,
  });

  if (transaction.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};
