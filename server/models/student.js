const sequelize = require('../util/database');
const Account = require('./account');
const DataTypes = require('sequelize').DataTypes;
const dayjs = require('dayjs');
const classDetails = require('./classdetail');

const Student = sequelize.define('student', {
	id: {
		type: DataTypes.STRING(10),
		allowNull: false,
		unique: true,
		primaryKey: true,
	},
	fullname: {
		type: DataTypes.STRING(50),
		allowNull: false,
	},
	dob: {
		type: DataTypes.DATEONLY,
		allowNull: false,
		get: function () {
			return dayjs(this.getDataValue('dob')).format('D-M-YYYY');
		},
	},
	accountId: {
		type: DataTypes.INTEGER,
		references: { model: Account, key: 'id' },
	},
});

Student.createAccount = async function (studentData) {
	const { password, id, fullname, type, foreignKey, dob } = studentData;
	console.log(id);
	const account = await Account.create({
		password: password || '',
		type: 'SV',
		classDetails: {},
	});
	const student = await Student.create({
		id,
		dob,
		fullname,
		majorId: foreignKey,
	});

	await student.setAccount(account);
	const result = await Student.findOne({ where: { id }, include: Account });
	return result;
};

module.exports = Student;
