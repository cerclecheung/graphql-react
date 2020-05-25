import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import Sequelize, { INTEGER } from 'sequelize';
import axios from 'axios';
import { UserInputError } from 'apollo-server';

const toCursorHash = (string) =>
  Buffer.from(string).toString('base64');

const fromCursorHash = (string) =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    transactions: async (
      parent,
      { cursor, limit = 100 },
      { models, me },
    ) => {
      const transactions = await models.Transaction.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        where: cursor
          ? {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
              userId: me.id,
            }
          : { userId: me.id },
      });
      const hasNextPage = transactions.length > limit;
      const edges = hasNextPage
        ? transactions.slice(0, -1)
        : transactions;
      console.log('hasNextPage', hasNextPage);
      return {
        edges: edges,
        transactionPageInfo: {
          hasNextPage,
          endCursor: transactions.length
            ? toCursorHash(
                edges[edges.length - 1].createdAt.toString(),
              )
            : null,
        },
      };
    },

    portfolio: async (parent, { limit = 100 }, { models, me }) => {
      const transactionSum = await models.Transaction.findAll({
        where: {
          userId: me.id,
        },
        attributes: [
          'symbol',
          [Sequelize.fn('sum', Sequelize.col('quantity')), 'total'],
        ],
        group: ['symbol'],
      });

      // in case there is not purchase yet, it shouldn;t be reduced
      if (!transactionSum[0]) {
        return transactionSum;
      }

      const symbols = transactionSum.reduce((accu, ele) => {
        accu.push(ele.symbol);
        return accu;
      }, []);
      const symbolsToString = symbols.join(',');
      const { data } = await axios({
        method: 'get',
        url: `https://cloud.iexapis.com/v1/stock/market/batch`,
        params: {
          types: 'quote',
          symbols: symbolsToString,
          token: process.env.IEX_TOKEN,
        },
      });
      const portfolio = transactionSum.reduce((accu, ele) => {
        const q = data[ele.symbol].quote;
        const total = parseInt(ele.dataValues['total'], 10);
        accu.push({
          symbol: ele.symbol,
          totalQuantity: total,
          value: (q.latestPrice * total).toFixed(2),
          color:
            q.open > q.latestPrice
              ? 'red'
              : q.open === q.latestPrice
              ? 'grey'
              : 'green',
        });
        return accu;
      }, []);

      return portfolio;
    },
  },
  Mutation: {
    createTransaction: combineResolvers(
      isAuthenticated,
      async (parent, { symbol, quantity }, { me, models }) => {
        try {
          const { data } = await axios({
            method: 'get',
            url: `https://cloud.iexapis.com/v1/stock/${symbol}/batch`,
            params: {
              types: 'quote',
              token: process.env.IEX_TOKEN,
            },
          });
          const currentPrice = data[symbol].quote.latestPrice;

          //handle  balance insufficiency
          if (me.balance < currentPrice * quantity) {
            throw new UserInputError('Not enought balance');
          }
          const transaction = await models.Transaction.create({
            text,
            userId: me.id,
          });
          return transaction;
        } catch (error) {
          // handle ticker error
          console.log(error);
        }
      },
    ),
  },

  Transaction: {
    user: async (transaction, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
};
