import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
	getUsersForSidebar,
	randomizeUserAvatars,
	randomizeMyAvatar,
	toggleBlockUser,
	toggleMuteUser,
	sendFriendRequestByUsername,
	acceptFriendRequest,
	rejectFriendRequest,
	getFriendRequests,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/randomize-avatars", randomizeUserAvatars);
router.post("/randomize-avatars", randomizeUserAvatars);
router.get("/randomize-my-avatar", protectRoute, randomizeMyAvatar);
router.post("/randomize-my-avatar", protectRoute, randomizeMyAvatar);
router.post("/block/:id", protectRoute, toggleBlockUser);
router.post("/mute/:id", protectRoute, toggleMuteUser);
router.post("/friend-request/send", protectRoute, sendFriendRequestByUsername);
router.post("/friend-request/accept/:id", protectRoute, acceptFriendRequest);
router.post("/friend-request/reject/:id", protectRoute, rejectFriendRequest);
router.get("/friend-requests", protectRoute, getFriendRequests);
router.get("/", protectRoute, getUsersForSidebar);

export default router;
