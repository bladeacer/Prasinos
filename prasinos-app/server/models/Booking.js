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
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        pax: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'events',
                key: 'id',
            }
        }
    }, {
        tableName: 'bookings'
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
        Booking.belongsTo(models.Event, {
            foreignKey: "eventId",
            as: 'event'
        });
    };

    return Booking;
}
