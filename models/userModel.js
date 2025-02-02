export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      phone: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
          is: /^09\d{9}$/,
          len: {
            args: 11,
            msg: "Phone Number must be atleast 11 characters in length"
        },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
              args: 3,
              msg: "Name must be atleast 3 characters in length"
          }
      }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
              args: 8
          }
      }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "/images/default.png",
      },
      is_online: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "0",
      },
    },
    {
      timestamps: true,
    }
  );

  return User;
};