import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import Sequelize from 'sequelize';
import axios from 'axios';
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

    portfolio: async (parent, { limit = 100 }, { models }) => {
      const portfolio = await models.Transaction.findAll({
        attributes: [
          'symbol',
          [Sequelize.fn('sum', Sequelize.col('quantity')), 'total'],
        ],
        group: ['symbol'],
      });

      const symbols = portfolio.reduce((accu, ele) => {
        accu.push(ele.symbol);
        return accu;
      }, []);
      const symbolsToString = symbols.join(',');
      const res = await axios({
        method: 'get',
        url: `https://cloud.iexapis.com/v1/stock/market/batch`,
        // headers: {
        //   Authorization: `Basic ${idSecret64}`,
        // },
        params: {
          types: 'quote',
          symbols: symbolsToString,
          token: process.env.IEX_TOKEN,
        },
      });
      console.log(res);

      // console.log(
      //   portfolio[0]['symbol'],
      //   typeof portfolio[0],
      //   typeof portfolio[0].dataValues['total'],
      //   Object.keys(portfolio[0].dataValues),
      // );
      return portfolio;
    },
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
