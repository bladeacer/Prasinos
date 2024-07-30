module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateTimeBooked: {
            type: DataTypes.DATE,
            allowNull: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'events',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        pax: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1  // Sets the default value to 1
        },
        attendance: {
            type: DataTypes.JSON,
            allowNull: true,
        }
    }, {
        tableName: 'bookings'
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
        Booking.belongsTo(models.Event, { as: 'event', foreignKey: 'eventId' });
    };

    return Booking;
};
