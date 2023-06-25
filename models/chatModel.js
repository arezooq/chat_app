export default (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    "chat",
    {
      sender_id: {
        type: DataTypes.STRING,
        reference: "users",
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.STRING,
        reference: "users",
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
        isDate: true,
      },
      isRead: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Chat;
};