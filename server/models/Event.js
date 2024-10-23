module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        eventName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        eventDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        eventLocation: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        eventStartDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        eventEndDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        eventStartTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        eventEndTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        eventOrganizerType: {
            type: DataTypes.ENUM('individual', 'organization',"community club","government agency"),
            allowNull: false
        },
        eventOrganizerName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        eventScope: {
            type: DataTypes.ENUM('open', 'invitation'),
            allowNull: false
        },
        expectedAttendance: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        participationFee: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        eventActivity: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        otherEventActivity: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        contactNumber: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        useAccountInfo: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        consentApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        termsApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        supportingDocs: {
            type: DataTypes.JSON, // or JSONB if using PostgreSQL
            allowNull: true
        },
        fundingRequests: {
            type: DataTypes.JSON, // or JSONB if using PostgreSQL
            allowNull: true
        },
        eventImage: {
            type: DataTypes.STRING, // Ensure this matches the field type in your database
            allowNull: true // or false if eventImage is required
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        adminComment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eventStatus: {
            type: DataTypes.ENUM("Pending Review", "Approved","Rejected","Action Needed","Draft"),
            allowNull: false
        },
        requestChangefields: {
            type: DataTypes.JSON,
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
    };

    return Event;
};

