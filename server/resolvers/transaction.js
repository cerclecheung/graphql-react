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

    portfolioPage: async (
      parent,
      { limit = 100 },
      { models, me },
    ) => {
      const user = await models.User.findByPk(me.id);
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
        return { portfolio: [], user };
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
      console.log(data);
      const portfolio = transactionSum.reduce((accu, ele) => {
        console.log(ele.symbol, data[ele.symbol]);
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

      return { portfolio, user };
    },
  },
  Mutation: {
    createTransaction: combineResolvers(
      isAuthenticated,
      async (parent, { symbol, quantity }, { me, models }) => {
        let res;
        try {
          const { data } = await axios({
            method: 'get',
            url: `https://cloud.iexapis.com/v1/stock/${symbol}/batch`,
            params: {
              types: 'quote',
              token: process.env.IEX_TOKEN,
            },
          });
          res = data;
        } catch (error) {
          // handle ticker error
          console.log(error);
        }
        const { open, latestPrice } = res.quote;

        // handle market not yet open
        // if (!open) {
        //   throw new UserInputError(
        //     'Please make request when market is open',
        //   );
        // }
        const totalCost = latestPrice * quantity;
        console.log(latestPrice);
        console.log('totalCost', totalCost);

        const user = await models.User.findByPk(me.id);
        console.log(user.username);

        //handle balance insufficiency
        if (user.balance < totalCost) {
          console.log(user.balance);
          throw new UserInputError('Not enought balance');
        }
        const transaction = await models.Transaction.create({
          symbol,
          quantity,
          price: latestPrice,
          userId: me.id,
        });

        user.balance -= totalCost;
        await user.save();

        return transaction;
      },
    ),
  },

  Transaction: {
    user: async (transaction, args, { models }) => {
      return await models.User.findByPk(transaction.userId);
    },
  },
};
