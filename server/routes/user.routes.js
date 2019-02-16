import { Router } from "express";
import {
	create,
	userById,
	read,
	list,
	update,
	remove,
	photo,
	addFollowing,
	addFollower,
	removeFollowing,
	removeFollower,
	findPeople,
	defaultPhoto
} from "../constrollers/user.controller";
import {
	requireSignin,
	hasAuthorization
} from "../constrollers/auth.controller";

const api = new Router();

api.route("/api/users")
	.get(list)
	.post(create);

api.route("/api/users/photo/:userId").get(photo, defaultPhoto);
api.route("/api/users/defaultphoto").get(defaultPhoto);

api.route("/api/users/follow").put(requireSignin, addFollowing, addFollower);
api.route("/api/users/unfollow").put(
	requireSignin,
	removeFollowing,
	removeFollower
);

api.route("/api/users/findpeople/:userId").get(requireSignin, findPeople);

api.route("/api/users/:userId")
	.get(requireSignin, read)
	.put(requireSignin, hasAuthorization, update)
	.delete(requireSignin, hasAuthorization, remove);

api.param("userId", userById);

export default api;
