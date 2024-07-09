module.exports = (sequelize, DataTypes) => {
  const Reward = sequelize.define(
    "Reward",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      points_needed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tier_required: {
        type: DataTypes.ENUM,
        values: ["Bronze", "Silver", "Gold"],
        allowNull: false,
      },      
      imageFile: {
        type: DataTypes.STRING,
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
