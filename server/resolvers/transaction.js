import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import { Sequelize } from 'sequelize';
// import pubsub, { EVENTS } from '../subscription';

const toCursorHash = (string) =>
  Buffer.from(string).toString('base64');

const fromCursorHash = (string) =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    transactions: async (
      parent,
      { cursor, limit = 100 },
      { models },
    ) => {
      console.log('limit', limit);
      const transactions = await models.Transaction.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        where: cursor
          ? {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            }
          : null,
      });
      const hasNextPage = transactions.length > limit;
      const edges = hasNextPage
        ? transactions.slice(0, -1)
        : transactions;
      return {
        edges: edges,
        transactionPageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
    // transaction: async (parent, { id }, { models }) => {
    //   return await models.Transaction.findByPk(id);
    // },
  },
  Mutation: {
    createTransaction: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        const transaction = await models.Transaction.create({
          text,
          userId: me.id,
        });
        // publishing to events.message.created

        // pubsub.publish(EVENTS.MESSAGE.CREATED, {
        //   transationCreated: { transation },
        // });
        return transaction;
      },
    ),

    // deleteMessage: combineResolvers(
    //   isMessageOwner,
    //   async (parent, { id }, { models }) => {
    //     return await models.Message.destroy({ where: { id } });
    //   },
    // ),
  },

  Transaction: {
    user: async (transaction, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
  // Subscription: {
  //   messageCreated: {
  //     subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
  //   },
  // },
};
