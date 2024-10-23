module.exports = (sequelize, DataTypes) => {
    const Otp = sequelize.define('Otp', {
        otp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        otpFor: {
            type: DataTypes.ENUM,
            values: ["user", "staff"],
            allowNull: false // Can be 'user' or 'staff'
        },
        otpForId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'otps'
    });

    // Define relationships
    Otp.associate = (models) => {
        Otp.belongsTo(models.User, { foreignKey: 'otpForId', constraints: false, targetKey: 'id', as: 'user' });
        Otp.belongsTo(models.Staff, { foreignKey: 'otpForId', constraints: false, targetKey: 'id', as: 'staff' });
    }

    return Otp;
}
