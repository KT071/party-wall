const UserModel = require("../models/UserModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const jwt = require("jsonwebtoken");

/**
 * User registration.
 *
 * @param {string}      userName
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
	body("userName").isLength({ min: 1 }).trim().withMessage("First name must be specified.").custom((value) => {
			return UserModel.findOne({userName : value}).then((user) => {
				if (user) {
					return Promise.reject("User name already in use");
				}
			});
		}),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	sanitizeBody("userName").escape(),
	sanitizeBody("password").escape(),

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				const user = new UserModel(
					{
						userName: req.body.userName,
						password: req.body.password,
					}
				);

				user.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let userData = {
						_id: user._id,
						userName: user.userName,
					};
					return apiResponse.successResponseWithData(res,"Registration Success.", userData);
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("userName").isLength({ min: 1 }).trim().withMessage("User name must be specified."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	sanitizeBody("userName").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else{
				UserModel.findOne({userName : req.body.userName}).then(user => {
					if (user) {
						if(req.body.password === user.password){
							let userData = {
								_id: user._id,
								userName: user.userName,
							};
							const jwtPayload = userData;
							const jwtData = {
								expiresIn: process.env.JWT_TIMEOUT_DURATION,
							};
							const secret = process.env.JWT_SECRET;
							userData.token = jwt.sign(jwtPayload, secret, jwtData);
							return apiResponse.successResponseWithData(res,"Login Success.", userData);
						}else{
							return apiResponse.unauthorizedResponse(res, "User name or Password wrong.");
						}
					}else{
						return apiResponse.unauthorizedResponse(res, "User name or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];
