module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      tier: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      tableName: "users",
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Reward, {
      foreignKey: "userId",
      onDelete: "cascade",
      as: "rewards",
    });
  };
  return User;
};
