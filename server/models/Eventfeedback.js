module.exports = (sequelize, DataTypes) => {
    const EventFeedback = sequelize.define("EventFeedback", {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'EventFeedback'
    });
    return EventFeedback;
}