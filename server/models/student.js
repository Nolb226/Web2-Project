const sequelize = require('../util/database');
const Account = require('./account');
const DataTypes = require('sequelize').DataTypes;
const dayjs = require('dayjs');
const classDetails = require('./classdetail');
const Permission_Group = require('./permission_group');
const { errorResponse, throwError } = require('../util/helper');

const Student = sequelize.define('student', {
	id: {
		type: DataTypes.STRING(10),
		allowNull: false,
		unique: true,
		primaryKey: true,
	},
	fullname: {
		type: DataTypes.STRING(50),
		// allowNull: false,
	},
	dob: {
		type: DataTypes.DATEONLY,
		// allowNull: false,
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
	try {
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
		if (!student) {
			throwError(`Database`, 500);
		}

		const permission = await Permission_Group.findOne({
			where: { name: 'SV' },
		});
		if (!permission) {
			throwError('Group permission not found', 404);
		}

		await student?.setAccount(account);
		await permission.addAccount(account);

		const result = await Student.findOne({
			where: { id },
			include: [{ model: Account, attribute: ['type'] }],
		});
		return result;
	} catch (error) {
		console.log(error);
		throwError(error.message, 401);
	}
};

module.exports = Student;
