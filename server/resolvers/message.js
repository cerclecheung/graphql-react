import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isMessageOwner } from './authorization';
import { Sequelize } from 'sequelize';

const toCursorHash = (string) =>
  Buffer.from(string).toString('base64');

const fromCursorHash = (string) =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const messages = await models.Message.findAll({
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
      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;
      return {
        edges: edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },
  },
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        console.log('me', me);
        return await models.Message.create({
          text,
          userId: me.id,
        });
      },
    ),

    deleteMessage: combineResolvers(
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      },
    ),
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
};
