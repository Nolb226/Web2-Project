const { QueryTypes } = require('sequelize');
const Functions = require('../models/function');
const sequelize = require('../util/database');
const { successResponse, errorResponse } = require('../util/helper');
const Account = require('../models/account');

exports.getUserAccount = async (req, res, _) => {
	try {
		const user = await Account.findByPk(req.account.id);
		successResponse(res, 200, user);
	} catch (error) {
		errorResponse(res, error);
	}
};

exports.getCurrentPermission = async (req, res, _) => {
	try {
		const permissions = await sequelize.query(
			`
		
		SELECT	method,
				path
		FROM	permissiongroups
		JOIN	accounts
		ON		accounts.type = permissiongroups.id
		JOIN	functiondetail
		ON		functiondetail.permissiongroupId = permissiongroups.id
		JOIN	functions
		ON		functions.id = functiondetail.functionId
		WHERE	accounts.id = "${req.account.id}"
		
		`,
			{
				type: QueryTypes.SELECT,
			}
		);
		successResponse(res, 200, permissions);
	} catch (error) {
		errorResponse(res, error);
	}
};

exports.getNotify = async (req, res, _) => {
	try {
		const notify = await sequelize.query(
			`
			SELECT *
			FROM	noftifications
			JOIN	
			`
		);
	} catch (error) {
		errorResponse(res, 200);
	}
};
