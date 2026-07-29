import path from "path";
import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import User from "./models/user.model.js";
import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false })); // Use helmet for security headers, relax CSP for external DiceBear SVG avatars
app.use(morgan("dev")); // HTTP request logging
app.use(express.json({ limit: "5mb" })); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api", apiLimiter); // Apply general API rate limiting
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Live Database Inspector routes
app.get("/api/db/json", async (req, res) => {
	try {
		const users = await User.find({}).select("-password");
		const messages = await Message.find({});
		const conversations = await Conversation.find({}).populate("participants", "username fullName");
		res.status(200).json({ users, messages, conversations });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/api/db", async (req, res) => {
	try {
		const users = await User.find({}).select("-password");
		const messages = await Message.find({});
		const conversations = await Conversation.find({}).populate("participants", "username fullName");

		const html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<title>MERN Chat App - Live Database Inspector</title>
			<style>
				body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }
				h1 { color: #818cf8; margin-bottom: 0.5rem; }
				.stats { display: flex; gap: 1rem; margin-bottom: 2rem; }
				.card { background: #1e293b; padding: 1rem 1.5rem; border: 1px solid #334155; border-radius: 12px; }
				.card h3 { margin: 0; font-size: 0.9rem; color: #94a3b8; }
				.card p { margin: 5px 0 0; font-size: 1.8rem; font-weight: bold; color: #38bdf8; }
				table { width: 100%; border-collapse: collapse; margin-bottom: 2.5rem; background: #1e293b; border-radius: 8px; overflow: hidden; }
				th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #334155; }
				th { background: #0f172a; color: #818cf8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
				tr:hover { background: #334155; }
				img.avatar { width: 36px; height: 36px; border-radius: 50%; background: #334155; vertical-align: middle; }
				a.btn { display: inline-block; padding: 8px 16px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
				a.btn:hover { background: #4338ca; }
				.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; background: #334155; color: #e2e8f0; }
			</style>
		</head>
		<body>
			<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
				<h1>Live Database Inspector</h1>
				<div>
					<a href="/api/db/json" class="btn" target="_blank">View Raw JSON</a>
					<a href="/" class="btn" style="background: #0ea5e9;">Back to App</a>
				</div>
			</div>
			<div class="stats">
				<div class="card"><h3>Total Users</h3><p>${users.length}</p></div>
				<div class="card"><h3>Total Conversations</h3><p>${conversations.length}</p></div>
				<div class="card"><h3>Total Messages</h3><p>${messages.length}</p></div>
			</div>

			<h2>Users Collection</h2>
			<table>
				<thead>
					<tr>
						<th>Avatar</th>
						<th>Full Name</th>
						<th>Username</th>
						<th>Gender</th>
						<th>ID</th>
						<th>Created At</th>
					</tr>
				</thead>
				<tbody>
					${
						users.length === 0
							? '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No users in database</td></tr>'
							: users
									.map(
										(u) => `
						<tr>
							<td><img src="${u.profilePic}" class="avatar" alt="${u.username}" /></td>
							<td><strong>${u.fullName}</strong></td>
							<td>@${u.username}</td>
							<td><span class="badge">${u.gender}</span></td>
							<td><code style="color:#94a3b8;">${u._id}</code></td>
							<td>${new Date(u.createdAt).toLocaleString()}</td>
						</tr>
					`
									)
									.join("")
					}
				</tbody>
			</table>

			<h2>Messages Collection</h2>
			<table>
				<thead>
					<tr>
						<th>Sender ID</th>
						<th>Receiver ID</th>
						<th>Message Content</th>
						<th>Sent At</th>
					</tr>
				</thead>
				<tbody>
					${
						messages.length === 0
							? '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">No messages sent yet</td></tr>'
							: messages
									.map(
										(m) => `
						<tr>
							<td><code>${m.senderId}</code></td>
							<td><code>${m.receiverId}</code></td>
							<td>${m.message}</td>
							<td>${new Date(m.createdAt).toLocaleString()}</td>
						</tr>
					`
									)
									.join("")
					}
				</tbody>
			</table>

			<h2>Conversations Collection</h2>
			<table>
				<thead>
					<tr>
						<th>Conversation ID</th>
						<th>Participants</th>
						<th>Total Messages</th>
						<th>Last Updated</th>
					</tr>
				</thead>
				<tbody>
					${
						conversations.length === 0
							? '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">No conversations started yet</td></tr>'
							: conversations
									.map(
										(c) => `
						<tr>
							<td><code>${c._id}</code></td>
							<td>${c.participants.map((p) => `<strong>${p.fullName}</strong> (@${p.username})`).join(" ↔ ")}</td>
							<td><span class="badge">${c.messages.length} messages</span></td>
							<td>${new Date(c.updatedAt).toLocaleString()}</td>
						</tr>
					`
									)
									.join("")
					}
				</tbody>
			</table>
		</body>
		</html>
		`;

		res.status(200).send(html);
	} catch (err) {
		res.status(500).send(`<h1>Error inspecting DB: ${err.message}</h1>`);
	}
});

app.use(errorHandler);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	const indexPath = path.join(__dirname, "frontend", "dist", "index.html");
	if (fs.existsSync(indexPath)) {
		res.sendFile(indexPath);
	} else {
		res.status(503).send("<h1>LiveChatting is building the frontend... Please refresh the page in 15 seconds.</h1>");
	}
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
