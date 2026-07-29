import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			default: "",
		},
		reactions: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				emoji: String,
			},
		],
		status: {
			type: String,
			enum: ["sent", "delivered", "read"],
			default: "sent",
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

// Compound index for fast message retrieval between two users
messageSchema.index({ senderId: 1, receiverId: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
