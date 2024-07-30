module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
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
        role: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'admin'
        }
    }, {
        tableName: 'admins'
    });

    Admin.associate = (models) => {
        Admin.hasMany(models.Event, {
            foreignKey: "adminId",
            onDelete: "cascade"
        });
    };

    return Admin;
}