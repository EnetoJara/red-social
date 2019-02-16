import { model, Schema } from "mongoose";

const { ObjectId, } = Schema;
const PostSchema = new Schema({
	text: {
		type: String,
		required: "Name is required",
	},
	photo: {
		data: Buffer,
		contentType: String,
	},
	likes: [{ type: ObjectId, ref: "User", }],
	comments: [
		{
			text: String,
			created: { type: Date, default: Date.now, },
			postedBy: { type: ObjectId, ref: "User", },
		}
	],
	postedBy: { type: ObjectId, ref: "User", },
	created: {
		type: Date,
		default: Date.now,
	},
});

export default model("Post", PostSchema);
