module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'events',
                key: 'id'
            }
        },
        dateTimeBooked: {
            type: DataTypes.DATE,
            allowNull: true
        },
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
        pax: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1  // Sets the default value to 1
        }
    }, {
        tableName: 'bookings'
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.Event, {
            foreignKey: 'eventId',
            as: 'event'
        });
        Booking.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user',
            onDelete: "cascade"
        });
    };

    return Booking;
};
