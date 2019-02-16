import { isEmail, isLength, isEmpty } from "validator";
import { isNumber } from "util";

export const validateSignin = (user) => {
	const res = {};
	const email = user.email || "";
	const password = user.password || "";
	res.errors = false;
	if (isEmpty(email)) {
		res.email = "email is required";
		res.errors = true;
	}
	if (!isEmail(email)) {
		res.email = "is not a valid email fortmat";
		res.errors = true;
	}
	if (isEmpty(password)) {
		res.password = "password is required";
		res.errors = true;
	}
	if (!isLength(password, { min: 6, max: 16, })) {
		res.password =
			"password must be at least 6 characters long, and not greater than 15";
		res.errors = true;
	}
	return res;
};

export const validatesCreateUser = (user) => {
	const name = user.name || "";
	const about = user.about || "";
	const password = user.password || "";
	const password2 = user.password2 || "";
	let res = {
		rerrors: false,
	};

	res = validateSignin(user);
	if (isEmpty(name)) {
		res.name = "Name is required";
		res.errors = true;
	}
	if (isNumber(name)) {
		res.name =
			"As long as I know, names are not numbers, unless you is a robot, are a robot ?";
		res.errors = true;
	}
	if (isEmail(name)) {
		res.name =
			"since when emails are valid names, get yow ass out of here with your non sence bull crap";
		res.errors = true;
	}
	if (!isEmpty(password) && password !== password2) {
		res.password2 = "passwords must match";
		res.errors = true;
	}
	if (!isLength(about, { min: 0, max: 250, })) {
		res.about =
			"you should not pull yow whole life, come down. no more than 250 characters, please";
		res.errors = true;
	}
	return res;
};
