export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      phone: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
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
