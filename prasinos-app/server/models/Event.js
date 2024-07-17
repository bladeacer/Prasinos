module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        eventName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        refCode: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        organization: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'events'
    });

    Event.associate = (models) => {
        Event.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
        Event.hasMany(models.Booking, {
            foreignKey: "eventId",
            as: 'bookings'
        });
    };

    return Event;
};
