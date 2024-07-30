module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'users'
    });

    User.associate = (models) => {
        User.hasMany(models.Event, {
            foreignKey: 'userId',
            as: 'events'
        });
        User.hasMany(models.Booking, {
            foreignKey: "userId",
            as: 'bookings',

            onDelete: "cascade"
        });
    };

    return User;
}
