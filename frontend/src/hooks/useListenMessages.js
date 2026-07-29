import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages, selectedConversation, incrementUnread, setLastMessage } = useConversation();
	const { authUser } = useAuthContext();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			if (authUser?.blockedUsers?.includes(newMessage.senderId)) {
				return; // Ignore real-time messages from blocked users
			}

			// Track last message for sidebar preview
			setLastMessage(newMessage.senderId, newMessage.message || "📷 Image");

			// If message is not from the currently selected conversation, increment unread
			if (!selectedConversation || selectedConversation._id !== newMessage.senderId) {
				incrementUnread(newMessage.senderId);
			}

			newMessage.shouldShake = true;
			if (!authUser?.mutedUsers?.includes(newMessage.senderId)) {
				const sound = new Audio(notificationSound);
				sound.play();
			}
			setMessages([...messages, newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages, authUser, selectedConversation, incrementUnread, setLastMessage]);
};
export default useListenMessages;
