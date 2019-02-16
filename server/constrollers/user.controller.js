import fs from "fs";
import extend from "lodash/extend";
import formidable from "formidable";
import User from "../models/user.model";
import errorHandler from "../utils/error.handler";
import { validatesCreateUser } from "../utils/user.validator";
import profileImage from "./../../client/assets/images/profile-pic.png";

export function create (req, res) {
	const isValid = validatesCreateUser({ ...req.body, });
	if (isValid.errors) return res.status(400).send({ ...isValid, });
	const user = new User({ ...req.body, });
	user.save((err) => {
		if (err) {
			return res
				.status(400)
				.json({ errors: errorHandler.getErrorMessage(err), });
		}
		return res.status(201).json({ message: "Successfully signed up!", });
	});
}

export function userById (req, res, next, id) {
	User.findById(id)
		.populate("following", "_id name")
		.populate("followers", "_id name")
		.exec((error, user) => {
			if (error || !user) {
				return res.status(404).send({ message: "User Not Found", });
			}
			req.profile = user;
			next();
		});
}

export function read (req, res) {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json({ ...req.profile, });
}

export function list (req, res) {
	User.find((error, users) => {
		if (err) {
			return res
				.status(500)
				.send({ error: errorHandler.getErrorMessage(error), });
		}
		return res.json(users);
	}).select("_id name email updated created");
}

export function update (req, res) {
	const form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Photo could not be uploaded",
			});
		}
		let user = req.profile;
		user = extend(user, fields);
		user.updated = Date.now();
		if (files.photo) {
			user.photo.data = fs.readFileSync(files.photo.path);
			user.photo.contentType = files.photo.type;
		}
		user.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler.getErrorMessage(err),
				});
			}
			user.hashed_password = undefined;
			user.salt = undefined;
			res.json(user);
		});
	});
}

export function remove (req, res) {
	const user = req.profile;
	user.remove((err, deletedUser) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err),
			});
		}
		deletedUser.hashed_password = undefined;
		deletedUser.salt = undefined;
		res.json(deletedUser);
	});
}

export function photo (req, res, next) {
	if (req.profile.photo.data) {
		res.set("Content-Type", req.profile.photo.contentType);
		return res.send(req.profile.photo.data);
	}
	next();
}

export const defaultPhoto = (req, res) =>
	res.sendFile(process.cwd() + profileImage);

export function addFollowing (req, res, next) {
	User.findByIdAndUpdate(
		req.body.userId,
		{ $push: { following: req.body.followId, }, },
		(err) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler.getErrorMessage(err),
				});
			}
			next();
		}
	);
}

export function addFollower (req, res) {
	const { followId, userId, } = req.body;
	User.findByIdAndUpdate(
		followId,
		{ $push: { followers: userId, }, },
		{ new: true, }
	)
		.populate("following", "_id name")
		.populate("follower", "_id name")
		.exec(function (error, result) {
			if (error) {
				return res
					.status(400)
					.json({ error: errorHandler.getErrorMessage(error), });
			}
			result.hashed_password = undefined;
			result.salt = undefined;
			return res.json(result);
		});
}

export function removeFollowing (req, res, next) {
	User.findByIdAndUpdate(
		req.body.userId,
		{ $pull: { following: req.body.unfollowId, }, },
		(err, result) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler.getErrorMessage(err),
				});
			}
			next();
		}
	);
}
export function removeFollower (req, res) {
	User.findByIdAndUpdate(
		req.body.unfollowId,
		{ $pull: { followers: req.body.userId, }, },
		{ new: true, }
	)
		.populate("following", "_id name")
		.populate("followers", "_id name")
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler.getErrorMessage(err),
				});
			}
			result.hashed_password = undefined;
			result.salt = undefined;
			res.json(result);
		});
}

export function findPeople (req, res) {
	const following = req.profile.following;
	following.push(req.profile._id);
	User.find({ _id: { $nin: following, }, }, (err, users) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler.getErrorMessage(err),
			});
		}
		res.json(users);
	}).select("_id name");
}
