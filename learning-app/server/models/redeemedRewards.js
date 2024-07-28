module.exports = (sequelize, DataTypes) => {
  const RedeemedRewards = sequelize.define("RedeemedRewards", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rewardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pointsNeeded: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeRedeemed: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  RedeemedRewards.associate = function (models) {
    RedeemedRewards.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    RedeemedRewards.belongsTo(models.Reward, {
      foreignKey: "rewardId",
      as: "reward",
    });
  };

  return RedeemedRewards;
};
