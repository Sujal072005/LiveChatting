import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const sendMessage = asyncHandler(async (req, res) => {
	const { message = "", image = "" } = req.body;
	const { id: receiverId } = req.params;
	const senderId = req.user._id;

	const sender = await User.findById(senderId);
	const receiver = await User.findById(receiverId);

	if (sender?.blockedUsers?.includes(receiverId)) {
		return res.status(403).json({ error: "You have blocked this user. Unblock to send messages." });
	}

	if (receiver?.blockedUsers?.includes(senderId)) {
		return res.status(403).json({ error: "Cannot send message. You have been blocked by this user." });
	}

	if (!sender?.friends?.includes(receiverId)) {
		return res.status(403).json({ error: "You must be friends with this user to send messages." });
	}

	let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [senderId, receiverId],
		});
	}

	const newMessage = new Message({
		senderId,
		receiverId,
		message,
		image,
		status: "sent",
	});

	if (newMessage) {
		conversation.messages.push(newMessage._id);
	}

	await Promise.all([conversation.save(), newMessage.save()]);

	const receiverSocketId = getReceiverSocketId(receiverId);
	if (receiverSocketId) {
		io.to(receiverSocketId).emit("newMessage", newMessage);
	}

	res.status(201).json(newMessage);
});

export const getMessages = asyncHandler(async (req, res) => {
	const { id: userToChatId } = req.params;
	const senderId = req.user._id;

	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 0; // 0 returns all for backward compatibility with existing frontend
	const skip = (page - 1) * limit;

	const conversation = await Conversation.findOne({
		participants: { $all: [senderId, userToChatId] },
	});

	if (!conversation) return res.status(200).json([]);

	let query = Message.find({ _id: { $in: conversation.messages } }).sort({ createdAt: 1 });

	if (limit > 0) {
		query = query.skip(skip).limit(limit);
	}

	const messages = await query.exec();

	res.status(200).json(messages);
});

export const toggleReaction = asyncHandler(async (req, res) => {
	const { id: messageId } = req.params;
	const { emoji } = req.body;
	const userId = req.user._id;

	const message = await Message.findById(messageId);
	if (!message) {
		return res.status(404).json({ error: "Message not found" });
	}

	const existingIndex = message.reactions.findIndex(
		(r) => r.userId.toString() === userId.toString() && r.emoji === emoji
	);

	if (existingIndex > -1) {
		message.reactions.splice(existingIndex, 1);
	} else {
		message.reactions = message.reactions.filter((r) => r.userId.toString() !== userId.toString());
		message.reactions.push({ userId, emoji });
	}

	await message.save();

	res.status(200).json({
		message: "Reaction updated",
		reactions: message.reactions,
	});
});

