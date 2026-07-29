export const validateSignup = (req, res, next) => {
	let { fullName, username, password, confirmPassword, gender } = req.body;

	if (!fullName || !username || !password || !confirmPassword || !gender) {
		return res.status(400).json({ error: "All fields are required" });
	}

	fullName = fullName.trim();
	username = username.trim();

	if (username.length < 3) {
		return res.status(400).json({ error: "Username must be at least 3 characters long" });
	}

	if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
		return res.status(400).json({ error: "Username can only contain letters, numbers, underscores, and hyphens" });
	}

	if (password.length < 6) {
		return res.status(400).json({ error: "Password must be at least 6 characters long" });
	}

	if (password !== confirmPassword) {
		return res.status(400).json({ error: "Passwords don't match" });
	}

	if (!["male", "female"].includes(gender)) {
		return res.status(400).json({ error: "Gender must be 'male' or 'female'" });
	}

	req.body.fullName = fullName;
	req.body.username = username;
	next();
};

export const validateLogin = (req, res, next) => {
	let { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: "Username and password are required" });
	}

	req.body.username = username.trim();
	next();
};

export const validateMessagePayload = (req, res, next) => {
	const { message } = req.body;

	if (!message || typeof message !== "string" || !message.trim()) {
		return res.status(400).json({ error: "Message content cannot be empty" });
	}

	req.body.message = message.trim();
	next();
};
