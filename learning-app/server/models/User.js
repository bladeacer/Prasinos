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
        type: DataTypes.ENUM,
        values: ["Bronze", "Silver", "Gold"],
        allowNull: false,
      },
      lastSpinDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      hasSpun: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
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
