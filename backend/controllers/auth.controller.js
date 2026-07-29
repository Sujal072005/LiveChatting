import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { asyncHandler } from "../middleware/error.middleware.js";

export const signup = asyncHandler(async (req, res) => {
	const { fullName, username, password, confirmPassword, gender } = req.body;

	if (password !== confirmPassword) {
		return res.status(400).json({ error: "Passwords don't match" });
	}

	const user = await User.findOne({ username });

	if (user) {
		return res.status(400).json({ error: "Username already exists" });
	}

	// HASH PASSWORD HERE
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Generate unique random seed for DiceBear avatars
	const randomSeed = Math.random().toString(36).substring(2, 10);

	const boyProfilePic = `https://api.dicebear.com/8.x/avataaars/svg?seed=${username}_${randomSeed}`;
	const girlProfilePic = `https://api.dicebear.com/8.x/lorelei/svg?seed=${username}_${randomSeed}`;
	const fallbackProfilePic = `https://api.dicebear.com/8.x/bottts/svg?seed=${username}_${randomSeed}`;

	const newUser = new User({
		fullName,
		username,
		password: hashedPassword,
		gender,
		profilePic: gender === "male" ? boyProfilePic : gender === "female" ? girlProfilePic : fallbackProfilePic,
	});

	if (newUser) {
		// Generate JWT token here
		generateTokenAndSetCookie(newUser._id, res);
		await newUser.save();

		res.status(201).json({
			_id: newUser._id,
			fullName: newUser.fullName,
			username: newUser.username,
			profilePic: newUser.profilePic,
		});
	} else {
		res.status(400).json({ error: "Invalid user data" });
	}
});

export const login = asyncHandler(async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

	if (!user || !isPasswordCorrect) {
		return res.status(400).json({ error: "Invalid username or password" });
	}

	generateTokenAndSetCookie(user._id, res);

	res.status(200).json({
		_id: user._id,
		fullName: user.fullName,
		username: user.username,
		profilePic: user.profilePic,
	});
});

export const logout = asyncHandler(async (req, res) => {
	res.cookie("jwt", "", { maxAge: 0 });
	res.status(200).json({ message: "Logged out successfully" });
});

