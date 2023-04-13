const sequelize = require('../util/database');
const { DataTypes } = require('sequelize');

const Notifications = sequelize.define('notification', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = Notifications;
