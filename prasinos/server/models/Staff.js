module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define("Staff", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName: 'staff'
    });

    Staff.associate = (models) => {
        Staff.hasMany(models.Otp, { foreignKey: 'otpForId', as: 'otps', onDelete: 'CASCADE' });
    }

    return Staff;
}
