import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation, unreadCounts, clearUnread, lastMessages } = useConversation();
	const { authUser } = useAuthContext();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	const isBlocked = authUser?.blockedUsers?.includes(conversation._id);
	const isMuted = authUser?.mutedUsers?.includes(conversation._id);

	const unreadCount = unreadCounts[conversation._id] || 0;
	const lastMessage = lastMessages[conversation._id];

	const handleClick = () => {
		setSelectedConversation(conversation);
		clearUnread(conversation._id);
	};

	return (
		<>
			<div
				className={`flex gap-3 items-center rounded-2xl p-3 cursor-pointer transition-all duration-200
				${
					isSelected
						? "bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-500/20 border-l-4 border-pink-400"
						: "hover:bg-slate-800/60 text-slate-300"
				}`}
				onClick={handleClick}
			>
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div
						className={`w-11 rounded-full ${
							isOnline ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-900" : ""
						}`}
					>
						<img src={conversation.profilePic} alt='user avatar' />
					</div>
				</div>

				<div className='flex flex-col flex-1 min-w-0'>
					<div className='flex gap-2 justify-between items-center'>
						<div className='flex items-center gap-1.5 min-w-0'>
							<p className='font-semibold truncate text-sm'>{conversation.fullName}</p>
							{isBlocked && <span title='Blocked User' className='text-xs'>🚫</span>}
							{isMuted && !isBlocked && <span title='Muted User' className='text-xs'>🔇</span>}
						</div>
						<div className='flex items-center gap-1.5 shrink-0'>
							{unreadCount > 0 && !isSelected && (
								<span className='min-w-[20px] h-5 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold px-1.5 shadow-lg shadow-pink-500/30 animate-pulse'>
									{unreadCount > 99 ? "99+" : unreadCount}
								</span>
							)}
							<span className='text-base'>{emoji}</span>
						</div>
					</div>
					<p className={`text-xs truncate ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
						{isBlocked
							? "Blocked"
							: lastMessage
							? lastMessage
							: isOnline
							? "Online now"
							: "Offline"}
					</p>
				</div>
			</div>

			{!lastIdx && <div className='divider my-1 py-0 h-px border-slate-800' />}
		</>
	);
};
export default Conversation;
