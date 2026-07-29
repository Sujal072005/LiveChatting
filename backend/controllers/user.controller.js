import User from "../models/user.model.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const getUsersForSidebar = asyncHandler(async (req, res) => {
	const loggedInUserId = req.user._id;
	const currentUser = await User.findById(loggedInUserId);
	const friendIds = currentUser.friends || [];

	const search = req.query.search || "";
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 0; // 0 returns all users for backward compatibility
	const skip = (page - 1) * limit;

	const filter = {
		_id: { $in: friendIds },
		...(search && {
			$or: [
				{ fullName: { $regex: search, $options: "i" } },
				{ username: { $regex: search, $options: "i" } },
			],
		}),
	};

	let query = User.find(filter).select("-password").sort({ fullName: 1 });

	if (limit > 0) {
		query = query.skip(skip).limit(limit);
	}

	const filteredUsers = await query.exec();

	res.status(200).json(filteredUsers);
});

export const randomizeUserAvatars = asyncHandler(async (req, res) => {
	const users = await User.find({});
	let updatedCount = 0;

	for (const user of users) {
		const randomSeed = Math.random().toString(36).substring(2, 10);

		user.profilePic =
			user.gender === "male"
				? `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.username}_${randomSeed}`
				: user.gender === "female"
				? `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.username}_${randomSeed}`
				: `https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}_${randomSeed}`;
		await user.save();
		updatedCount++;
	}

	res.status(200).json({
		message: `Successfully randomized profile pictures for ${updatedCount} user(s)!`,
		updatedCount,
		updatedUsers: users,
	});
});

export const randomizeMyAvatar = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	const randomSeed = Math.random().toString(36).substring(2, 10);

	user.profilePic =
		user.gender === "male"
			? `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.username}_${randomSeed}`
			: user.gender === "female"
			? `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.username}_${randomSeed}`
			: `https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}_${randomSeed}`;

	await user.save();

	res.status(200).json({
		message: "Updated your profile picture!",
		profilePic: user.profilePic,
		_id: user._id,
		fullName: user.fullName,
		username: user.username,
	});
});

export const toggleBlockUser = asyncHandler(async (req, res) => {
	const { id: targetUserId } = req.params;
	const currentUserId = req.user._id;

	if (targetUserId.toString() === currentUserId.toString()) {
		return res.status(400).json({ error: "You cannot block yourself." });
	}

	const user = await User.findById(currentUserId);
	const isBlocked = user.blockedUsers.includes(targetUserId);

	if (isBlocked) {
		user.blockedUsers = user.blockedUsers.filter(
			(id) => id.toString() !== targetUserId.toString()
		);
	} else {
		user.blockedUsers.push(targetUserId);
	}

	await user.save();

	res.status(200).json({
		message: isBlocked ? "User unblocked successfully." : "User blocked successfully.",
		blockedUsers: user.blockedUsers,
		isBlocked: !isBlocked,
	});
});

export const toggleMuteUser = asyncHandler(async (req, res) => {
	const { id: targetUserId } = req.params;
	const currentUserId = req.user._id;

	if (targetUserId.toString() === currentUserId.toString()) {
		return res.status(400).json({ error: "You cannot mute yourself." });
	}

	const user = await User.findById(currentUserId);
	const isMuted = user.mutedUsers.includes(targetUserId);

	if (isMuted) {
		user.mutedUsers = user.mutedUsers.filter(
			(id) => id.toString() !== targetUserId.toString()
		);
	} else {
		user.mutedUsers.push(targetUserId);
	}

	await user.save();

	res.status(200).json({
		message: isMuted ? "User unmuted successfully." : "User muted successfully.",
		mutedUsers: user.mutedUsers,
		isMuted: !isMuted,
	});
});

export const sendFriendRequestByUsername = asyncHandler(async (req, res) => {
	const { username } = req.body;
	const currentUserId = req.user._id;

	if (!username || !username.trim()) {
		return res.status(400).json({ error: "Username is required" });
	}

	const targetUser = await User.findOne({ username: username.trim() });
	if (!targetUser) {
		return res.status(404).json({ error: "User with this username does not exist" });
	}

	if (targetUser._id.toString() === currentUserId.toString()) {
		return res.status(400).json({ error: "You cannot send a friend request to yourself" });
	}

	const currentUser = await User.findById(currentUserId);

	if (currentUser.friends.includes(targetUser._id)) {
		return res.status(400).json({ error: "You are already friends with this user" });
	}

	if (currentUser.friendRequestsSent.includes(targetUser._id)) {
		return res.status(400).json({ error: "Friend request already sent" });
	}

	if (currentUser.friendRequestsReceived.includes(targetUser._id)) {
		currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(
			(id) => id.toString() !== targetUser._id.toString()
		);
		targetUser.friendRequestsSent = targetUser.friendRequestsSent.filter(
			(id) => id.toString() !== currentUserId.toString()
		);
		currentUser.friends.push(targetUser._id);
		targetUser.friends.push(currentUserId);

		await Promise.all([currentUser.save(), targetUser.save()]);
		return res.status(200).json({
			message: `You and @${targetUser.username} are now friends!`,
			isFriend: true,
		});
	}

	currentUser.friendRequestsSent.push(targetUser._id);
	targetUser.friendRequestsReceived.push(currentUserId);

	await Promise.all([currentUser.save(), targetUser.save()]);

	res.status(200).json({
		message: `Friend request sent to @${targetUser.username}!`,
	});
});

export const acceptFriendRequest = asyncHandler(async (req, res) => {
	const { id: senderId } = req.params;
	const currentUserId = req.user._id;

	const currentUser = await User.findById(currentUserId);
	const senderUser = await User.findById(senderId);

	if (!senderUser) {
		return res.status(404).json({ error: "User not found" });
	}

	currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(
		(id) => id.toString() !== senderId.toString()
	);
	senderUser.friendRequestsSent = senderUser.friendRequestsSent.filter(
		(id) => id.toString() !== currentUserId.toString()
	);

	if (!currentUser.friends.includes(senderId)) {
		currentUser.friends.push(senderId);
	}
	if (!senderUser.friends.includes(currentUserId)) {
		senderUser.friends.push(currentUserId);
	}

	await Promise.all([currentUser.save(), senderUser.save()]);

	res.status(200).json({
		message: `Friend request from @${senderUser.username} accepted!`,
		friends: currentUser.friends,
	});
});

export const rejectFriendRequest = asyncHandler(async (req, res) => {
	const { id: senderId } = req.params;
	const currentUserId = req.user._id;

	const currentUser = await User.findById(currentUserId);
	const senderUser = await User.findById(senderId);

	currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(
		(id) => id.toString() !== senderId.toString()
	);
	if (senderUser) {
		senderUser.friendRequestsSent = senderUser.friendRequestsSent.filter(
			(id) => id.toString() !== currentUserId.toString()
		);
		await senderUser.save();
	}

	await currentUser.save();

	res.status(200).json({
		message: "Friend request rejected.",
	});
});

export const getFriendRequests = asyncHandler(async (req, res) => {
	const currentUserId = req.user._id;
	const user = await User.findById(currentUserId).populate(
		"friendRequestsReceived",
		"_id username fullName profilePic gender"
	);

	res.status(200).json(user.friendRequestsReceived || []);
});

