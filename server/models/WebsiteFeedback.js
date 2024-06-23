module.exports = (sequelize, DataTypes) => {
    const WebsiteFeedback = sequelize.define("WebsiteFeedback", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 100]
            }
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true,
                len: [3, 100]
            }
        },
        reporttype: {
            type: DataTypes.ENUM('Bug Report', 'Feature Request', 'General Feedback'),
            allowNull: false,
        },
        elaboration: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 500]
            }
        }
    }, {
        tableName: 'WebsiteFeedback'
    });

    return WebsiteFeedback;
};
