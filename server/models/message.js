import { Sequelize } from 'sequelize';

const message = (db, DataTypes) => {
  const Message = db.define('message', {
    text: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'A message has to have a text' },
      },
    },
    // createdAt: {
    //   type: Sequelize.STRING,
    // },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User);
  };

  return Message;
};

export default message;
