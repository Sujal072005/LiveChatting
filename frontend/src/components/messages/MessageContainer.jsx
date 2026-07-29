import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import toast from "react-hot-toast";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { typingUsers, onlineUsers } = useSocketContext();
	const { authUser, setAuthUser } = useAuthContext();

	const isOnline = selectedConversation && onlineUsers.includes(selectedConversation._id);
	const isTyping = selectedConversation && typingUsers[selectedConversation._id];
	const isBlocked = authUser?.blockedUsers?.includes(selectedConversation?._id);
	const isMuted = authUser?.mutedUsers?.includes(selectedConversation?._id);

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	const handleToggleBlock = async () => {
		try {
			const res = await fetch(`/api/users/block/${selectedConversation._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			const updated = { ...authUser, blockedUsers: data.blockedUsers };
			localStorage.setItem("chat-user", JSON.stringify(updated));
			setAuthUser(updated);

			toast.success(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleToggleMute = async () => {
		try {
			const res = await fetch(`/api/users/mute/${selectedConversation._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			const updated = { ...authUser, mutedUsers: data.mutedUsers };
			localStorage.setItem("chat-user", JSON.stringify(updated));
			setAuthUser(updated);

			toast.success(data.message);
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className='flex-1 flex flex-col min-w-0 bg-slate-950/20'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-900/60 backdrop-blur-md border-b border-slate-700/50 px-6 py-3.5 flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='avatar'>
								<div className='w-10 rounded-full ring-1 ring-slate-600'>
									<img src={selectedConversation.profilePic} alt='user' />
								</div>
							</div>
							<div>
								<span className='text-slate-100 font-semibold block text-base flex items-center gap-1.5'>
									{selectedConversation.fullName}
									{isBlocked && (
										<span className='text-xs font-normal text-red-400 bg-red-950/50 px-2 py-0.5 rounded-full border border-red-800'>
											Blocked
										</span>
									)}
									{isMuted && !isBlocked && (
										<span className='text-xs font-normal text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800'>
											Muted
										</span>
									)}
								</span>
								{isTyping && !isBlocked ? (
									<span className='text-xs text-pink-400 font-semibold animate-pulse flex items-center gap-1'>
										<span className='w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping'></span>
										typing...
									</span>
								) : isOnline ? (
									<span className='text-xs text-emerald-400 font-medium flex items-center gap-1.5'>
										<span className='w-1.5 h-1.5 rounded-full bg-emerald-400'></span>
										Online
									</span>
								) : (
									<span className='text-xs text-slate-400 font-medium'>Offline</span>
								)}
							</div>
						</div>

						{/* Action Buttons: Mute & Block */}
						<div className='flex items-center gap-2'>
							<button
								onClick={handleToggleMute}
								className={`btn btn-xs rounded-xl px-2.5 py-1 border transition-all flex items-center gap-1 ${
									isMuted
										? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
										: "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700"
								}`}
								title={isMuted ? "Unmute Notifications" : "Mute Notifications"}
							>
								<span>{isMuted ? "🔇" : "🔔"}</span>
								<span>{isMuted ? "Muted" : "Mute"}</span>
							</button>
							<button
								onClick={handleToggleBlock}
								className={`btn btn-xs rounded-xl px-2.5 py-1 border transition-all flex items-center gap-1 ${
									isBlocked
										? "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
										: "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-red-600/30 hover:text-red-300 hover:border-red-500/40"
								}`}
								title={isBlocked ? "Unblock User" : "Block User"}
							>
								<span>{isBlocked ? "🚫" : "🛡️"}</span>
								<span>{isBlocked ? "Blocked" : "Block"}</span>
							</button>
						</div>
					</div>
					<div className='flex-1 overflow-y-auto px-6 py-4'>
						<Messages />
					</div>
					{isBlocked ? (
						<div className='p-4 bg-red-950/40 backdrop-blur-md border-t border-red-900/50 text-center text-red-300 text-sm font-medium flex items-center justify-center gap-2'>
							<span>🚫 You have blocked this user.</span>
							<button
								onClick={handleToggleBlock}
								className='underline font-bold text-red-200 hover:text-white transition-all'
							>
								Unblock to send messages
							</button>
						</div>
					) : (
						<MessageInput />
					)}
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full p-6'>
			<div className='max-w-md text-center flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900/30 border border-slate-800/60 shadow-xl'>
				<div className='w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10'>
					<TiMessages className='text-4xl animate-bounce' />
				</div>
				<div>
					<h2 className='text-2xl font-bold text-white mb-1'>
						Welcome,{" "}
						<span className='bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
							{authUser.fullName}
						</span>{" "}
						👋
					</h2>
					<p className='text-sm text-slate-400'>
						Select a conversation from the sidebar to start real-time messaging.
					</p>
				</div>
			</div>
		</div>
	);
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
