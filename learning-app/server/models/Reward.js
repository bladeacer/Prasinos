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
        type: DataTypes.INTEGER, // Change type to INTEGER for integer values
        allowNull: false,
      },
      tier_required: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageFile: {
        type: DataTypes.STRING(20),
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
