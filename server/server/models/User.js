module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
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
      eventsJoined: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
      company: {
            type: DataTypes.STRING(150),
            defaultValue: "Add your company via settings"
        },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
      imageFile: {
            type: DataTypes.STRING(20),
            defaultValue: null
        },
      tier: {
        type: DataTypes.ENUM,
        values: ["Bronze", "Silver", "Gold"],
        allowNull: false,
        defaultValue: "Bronze"
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
    
  User.associate = (models) => {
     User.hasMany(models.EventFeedback, {
            foreignKey: "userId",
            onDelete: "cascade"
        });
    };
    
   User.associate = (models) => {
        User.hasMany(models.Otp, { foreignKey: 'otpForId', as: 'otps', onDelete: 'CASCADE' });
    }

    User.hasMany(models.RedeemedRewards, {
      foreignKey: "userId",
      as: "redeemedRewards",
    });

    User.hasMany(models.Event, {
      foreignKey: "userId",
      as: "events",
    });

    User.hasMany(models.Booking, {
      foreignKey: "userId",
      onDelete: "cascade",
      as: "bookings",
    });
  };

  return User;
};
