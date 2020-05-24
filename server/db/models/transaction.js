const transaction = (db, DataTypes) => {
  const Transaction = db.define('transaction', {
    symbol: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'A symbol is a must for transaction',
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          args: true,
          msg: "Well you can't buy or sell without a price",
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Well you can't buy or sell without a quantity",
        },
      },
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User);
    models.User.hasMany(Transaction);
  };

  return Transaction;
};

export default transaction;
