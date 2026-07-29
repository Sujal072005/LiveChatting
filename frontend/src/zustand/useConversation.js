import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
	unreadCounts: {},
	incrementUnread: (userId) =>
		set((state) => ({
			unreadCounts: {
				...state.unreadCounts,
				[userId]: (state.unreadCounts[userId] || 0) + 1,
			},
		})),
	clearUnread: (userId) =>
		set((state) => ({
			unreadCounts: {
				...state.unreadCounts,
				[userId]: 0,
			},
		})),
	lastMessages: {},
	setLastMessage: (userId, message) =>
		set((state) => ({
			lastMessages: {
				...state.lastMessages,
				[userId]: message,
			},
		})),
}));

export default useConversation;
