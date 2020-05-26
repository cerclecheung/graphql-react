import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isTransactionOwner } from './authorization';
import Sequelize from 'sequelize';
import axios from 'axios';
import { UserInputError, ApolloError } from 'apollo-server';

export default {
  Query: {
    transactions: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        const transactions = await models.Transaction.findAll({
          order: [['createdAt', 'DESC']],
          where: { userId: me.id },
        });
        return transactions;
      },
    ),

    portfolioPage: async (parent, args, { models, me }) => {
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
      // in case there is not purchase yet, it shouldn't be reduced
      if (!transactionSum[0]) {
        return { portfolio: [], user, currentValue: 0 };
      }
      // getting all the symbols from transactions and converting to string
      const symbols = transactionSum.reduce((accu, ele) => {
        accu.push(ele.symbol);
        return accu;
      }, []);
      const symbolsToString = symbols.join(',');

      let res;
      try {
        const { data } = await axios({
          method: 'get',
          url: `https://cloud.iexapis.com/v1/stock/market/batch`,
          params: {
            types: 'quote',
            symbols: symbolsToString,
            token: process.env.IEX_TOKEN,
          },
        });
        res = data;
      } catch (error) {
        console.error();
        throw new ApolloError(
          'Connection to IEX is not successful. Please try again',
        );
      }
      // declare variable for calculating  portfolio current worth
      let currentValue = 0;

      const portfolio = transactionSum.reduce((accu, ele) => {
        const q = res[ele.symbol].quote;
        const total = parseInt(ele.dataValues['total'], 10);
        let subValue = q.latestPrice * total;
        // calculating  portfolio current worth
        currentValue += subValue;
        accu.push({
          symbol: ele.symbol,
          totalQuantity: total,
          value: subValue.toFixed(2),
          color:
            q.open > q.latestPrice
              ? 'red'
              : q.open < q.latestPrice
              ? 'green'
              : 'gray',
        });
        return accu;
      }, []);

      return {
        portfolio,
        user,
        currentValue: currentValue.toFixed(2),
      };
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
          console.error();
          // handle ticker error
          if (error.response.data === 'Unknown symbol') {
            throw new UserInputError(error.response.data);
          }
          // handle other possible errors
          throw new ApolloError(
            'Connection to IEX is not successful. Please try again',
          );
        }

        // handle successful response but quote is null
        if (!res.quote) {
          throw new ApolloError(
            'IEX currently does not have this ticker information',
          );
        }

        const { open, latestPrice } = res.quote;

        // handle market not yet open
        if (!open) {
          throw new UserInputError(
            'Please make request when market is open',
          );
        }

        const totalCost = latestPrice * quantity;
        const user = await models.User.findByPk(me.id);

        //handle balance insufficiency
        if (user.balance < totalCost) {
          throw new UserInputError('Not enought balance');
        }
        // otherwise, let's buy the stock!
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
