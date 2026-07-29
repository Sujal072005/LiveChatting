import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { useState } from "react";
import toast from "react-hot-toast";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "🔥", "😢"];

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation, messages, setMessages } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe
		? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/15 rounded-2xl rounded-tr-sm"
		: "bg-slate-800/90 border border-slate-700/60 text-slate-100 backdrop-blur-md shadow-sm rounded-2xl rounded-tl-sm";

	const shakeClass = message.shouldShake ? "shake" : "";
	const enterClass = fromMe ? "msg-enter-right" : "msg-enter-left";

	const [showReactions, setShowReactions] = useState(false);

	const handleReaction = async (emoji) => {
		try {
			const res = await fetch(`/api/messages/react/${message._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ emoji }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			// Update the message reactions locally
			const updatedMessages = messages.map((m) =>
				m._id === message._id ? { ...m, reactions: data.reactions } : m
			);
			setMessages(updatedMessages);
		} catch (error) {
			toast.error(error.message);
		}
		setShowReactions(false);
	};

	const reactions = message.reactions || [];
	// Group reactions by emoji
	const reactionGroups = reactions.reduce((acc, r) => {
		acc[r.emoji] = (acc[r.emoji] || 0) + 1;
		return acc;
	}, {});

	return (
		<div className={`chat ${chatClassName} my-1.5 ${enterClass}`}>
			<div className='chat-image avatar'>
				<div className='w-9 rounded-full ring-1 ring-slate-700/50'>
					<img alt='User profile' src={profilePic} />
				</div>
			</div>
			<div
				className='relative group'
				onMouseEnter={() => setShowReactions(true)}
				onMouseLeave={() => setShowReactions(false)}
			>
				<div className={`chat-bubble min-h-0 py-2.5 px-4 text-sm font-normal leading-relaxed ${bubbleBgColor} ${shakeClass}`}>
					{message.image && (
						<img
							src={message.image}
							alt='Shared image'
							className='message-image rounded-xl mb-2 max-w-[220px] max-h-[200px] object-cover border border-white/10'
						/>
					)}
					{message.message}
				</div>

				{/* Reaction bar on hover */}
				{showReactions && (
					<div className={`reaction-bar absolute ${fromMe ? "right-0" : "left-0"} -top-9 flex gap-0.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl px-2 py-1 shadow-xl z-10`}>
						{REACTION_EMOJIS.map((emoji) => (
							<button
								key={emoji}
								onClick={() => handleReaction(emoji)}
								className='reaction-pill w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-700/60 text-base cursor-pointer'
							>
								{emoji}
							</button>
						))}
					</div>
				)}

				{/* Display existing reactions */}
				{Object.keys(reactionGroups).length > 0 && (
					<div className={`flex gap-1 mt-0.5 ${fromMe ? "justify-end" : "justify-start"}`}>
						{Object.entries(reactionGroups).map(([emoji, count]) => (
							<span
								key={emoji}
								className='inline-flex items-center gap-0.5 text-xs bg-slate-800/80 border border-slate-700/50 rounded-full px-1.5 py-0.5 cursor-pointer hover:bg-slate-700/60 transition-all'
								onClick={() => handleReaction(emoji)}
							>
								{emoji} {count > 1 && <span className='text-[10px] text-slate-400'>{count}</span>}
							</span>
						))}
					</div>
				)}
			</div>
			<div className='chat-footer opacity-60 text-[11px] font-medium text-slate-400 flex gap-1 items-center mt-1'>
				{formattedTime}
			</div>
		</div>
	);
};
export default Message;
