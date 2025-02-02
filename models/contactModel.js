export default (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "contact",
    {
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "phone",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return Contact;
};
