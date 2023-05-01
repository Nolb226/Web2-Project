const jwt = require('jsonwebtoken');

const bycrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const Account = require('../models/account');
const {
	errorResponse,
	throwError,
	successResponse,
} = require('../util/helper');
const { where } = require('sequelize');
const Permission_Group = require('../models/permission_group');
const { getIO } = require('../util/socket');
const socket = require('../util/socket');

// exports.signup = async (req, res, next) => {
// 	try {
// 		const errors = validationResult(req);

// 		if (!errors.isEmpty()) {
// 			throwError(errors.array(), 422);
// 		}

// 		const { username, password, type, fullname, dob, majors, department } =
// 			req.body;

// 		const upperCaseType = type.toUpperCase();

// 		const isExist = model.findByPk(username);
// 		if (isExist.accountId) {
// 			throwError('Account is already exist', 409);
// 		}
// 		const foreignKey = majors || department;
// 		upperCaseType === 'GV' ? req.body.departmentId : req.body.majorId;
// 		const account = await model.createAccount({
// 			id: username,
// 			fullname,
// 			dob,
// 			password: await bycrypt.hash(password, 10),
// 			upperCaseType,
// 			foreignKey,
// 		});

// 		return successResponse(res, 201, '', req.method);
// 	} catch (error) {
// 		errorResponse(res, error);
// 		console.log(error);
// 	}
// };

exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const account = await Account.findOne({
			where: {
				account_id: username,
			},
		});

		if (!account) {
			throwError('Username or password is incorrect', 401);
		}

		const isValid = bycrypt.compareSync(password, account.password);
		if (!isValid) {
			throwError('Username or password is incorrect', 401);
		}

		// if (!account.isActive) {
		// 	throwError('Account is not active', 401);
		// }

		const token = jwt.sign({ id: account.id }, 'group5', {
			expiresIn: '3d',
		});
		// getIO().on('connection', (socket) => {
		// 	socket.on('login', () => {
		// 		const classrooms = await
		// 	});
		// });
		res.status(200).json({ token, type: account.type });
		// res.status(200).json(token);
	} catch (error) {
		errorResponse(res, error);
	}
};
