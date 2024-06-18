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
        feedback: {
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

    return EventFeedback;
};
