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
            type: DataTypes.ENUM('Bug Report', 'Feature Request', 'General Feedback', 'Frequently Asked Questions'),
            allowNull: false,
        },
        elaboration: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 500]
            }
        },
        status: {
            type: DataTypes.ENUM('Unresolved', 'Resolved', 'In Progress'), // Added more status options
            allowNull: false,
            defaultValue: 'Unresolved'
        },
        imageFile: {
            type: DataTypes.STRING(255), // Increased length for better flexibility
            allowNull: true,
            validate: {
                isUrl: true // Ensure the image file is a valid URL if provided
            }
        },
        staffId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'websitefeedback', // Changed to snake_case for consistency with SQL conventions
    });

    WebsiteFeedback.associate = (models) => {
        WebsiteFeedback.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
        WebsiteFeedback.belongsTo(models.Staff, {
            foreignKey: "staffId",
            as: "staff",
          });
    };


    return WebsiteFeedback;
};
