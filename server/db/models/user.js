import bcrypt from 'bcrypt';
const user = (db, DataTypes) => {
  const User = db.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please enter an email',
        },
        isEmail: {
          args: true,
          msg: 'Email format is not valid',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [7, 42],
          msg: 'Password length must be between 7-42 characters',
        },
      },
    },
    role: {
      type: DataTypes.STRING,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 50000.0,
    },
  });

  //   associations
  User.associate = (models) => {
    User.hasMany(models.Transaction, { onDelete: 'CASCADE' });
  };

  //   signUp
  User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
  });
  User.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  //   signIn
  User.findByLogin = async (login) => {
    let user = await User.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };
  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;
