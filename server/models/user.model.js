import { model, Schema } from "mongoose";
import Crypto from "crypto";

const UserSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: "Name is required",
	},
	email: {
		type: String,
		trim: true,
		unique: "Email already exists",
		match: [/.+@.+\..+/, "Please fill a valid email address"],
		required: "Email is required",
	},
	hashed_password: {
		type: String,
		required: "Password is required",
	},
	salt: String,
	updated: Date,
	created: {
		type: Date,
		default: Date.now,
	},
	about: {
		type: String,
		trim: true,
	},
	photo: {
		data: Buffer,
		contentType: String,
	},
	following: [{ type: Schema.ObjectId, ref: "User", }],
	followers: [{ type: Schema.ObjectId, ref: "User", }],
});

UserSchema.virtual("password")
	.set(function (password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptPassword(password);
	})
	.get(function () {
		return this._password;
	});

UserSchema.methods = {
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},
	encryptPassword: function (password) {
		if (!password) return "";
		try {
			return Crypto.createHmac("sha1", this.salt)
				.update(password)
				.digest("hex");
		} catch (e) {
			return "";
		}
	},
	makeSalt: function () {
		return Math.round(new Date().valueOf() * Math.random()) + "";
	},
};

UserSchema.path("hashed_password").validate(function () {
	if (this._password && this._password.length < 6) {
		this.invalidate(
			"password",
			"Password must bet at least 6 characters long"
		);
	}
	if (this.isNew && !this._password) {
		this.invalidate("password", "Password is required");
	}
}, null);

export default model("User", UserSchema);
