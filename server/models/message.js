const message = (db, DataTypes) => {
  const Message = db.define('message', {
    text: {
      type: DataTypes.STRING,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User);
  };

  return Message;
};

export default message;
