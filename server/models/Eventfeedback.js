module.exports = (sequelize, DataTypes) => {
    const EventFeedback = sequelize.define("EventFeedback", {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 500]
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5
            }
        }
    }, {
        tableName: 'EventFeedback'
    });
    EventFeedback.associate = (models) => {
        EventFeedback.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return EventFeedback;
};
