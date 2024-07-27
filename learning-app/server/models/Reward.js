module.exports = (sequelize, DataTypes) => {
  const Reward = sequelize.define(
    "Reward",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      points_needed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tier_required: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageFile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "rewards",
    }
  );

  Reward.associate = (models) => {
    Reward.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Reward;
};
