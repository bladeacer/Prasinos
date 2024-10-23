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
      staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "rewards",
    }
  );

  Reward.associate = (models) => {
    Reward.belongsTo(models.Staff, {
      foreignKey: "staffId",
      as: "staff",
    });
  };

  return Reward;
};
