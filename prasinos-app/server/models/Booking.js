module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageFile: {
            type: DataTypes.STRING(20)
        }
    }, {
        tableName: 'bookings'
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Booking;
}
