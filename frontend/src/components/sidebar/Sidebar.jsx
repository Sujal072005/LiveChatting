import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";
import { useState, useEffect } from "react";
import ProfileDrawer from "./ProfileDrawer";
import NewGroupModal from "./NewGroupModal";
import AddFriendModal from "./AddFriendModal";
import FriendRequestsModal from "./FriendRequestsModal";
import { IoPeopleOutline, IoPersonAddOutline, IoNotificationsOutline } from "react-icons/io5";

const Sidebar = () => {
	const { authUser, setAuthUser } = useAuthContext();
	const { theme, toggleTheme } = useThemeContext();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isGroupOpen, setIsGroupOpen] = useState(false);
	const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
	const [isRequestsOpen, setIsRequestsOpen] = useState(false);
	const [requestCount, setRequestCount] = useState(0);

	const fetchRequestCount = async () => {
		try {
			const res = await fetch("/api/users/friend-requests");
			const data = await res.json();
			if (!data.error && Array.isArray(data)) {
				setRequestCount(data.length);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchRequestCount();
		const interval = setInterval(fetchRequestCount, 10000);
		return () => clearInterval(interval);
	}, []);

	const handleRandomizeMyAvatar = async () => {
		try {
			const res = await fetch("/api/users/randomize-my-avatar", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			const currentUser = JSON.parse(localStorage.getItem("chat-user")) || authUser;
			if (currentUser && data.profilePic) {
				currentUser.profilePic = data.profilePic;
				localStorage.setItem("chat-user", JSON.stringify(currentUser));
				setAuthUser({ ...currentUser, profilePic: data.profilePic });
			}

			toast.success("Updated your profile picture!");
		} catch (err) {
			toast.error(err.message || "Failed to randomize avatar");
		}
	};

	return (
		<>
			<div className='w-72 md:w-80 border-r border-slate-700/60 bg-slate-900/40 p-4 flex flex-col'>
				<div className='flex items-center justify-between px-2 pb-3'>
					<div
						className='flex items-center gap-2.5 cursor-pointer group'
						onClick={() => setIsProfileOpen(true)}
						title='Click to view profile'
					>
						{authUser && (
							<div className='avatar'>
								<div className='w-8 h-8 rounded-full ring-2 ring-indigo-500/50 group-hover:ring-indigo-400 overflow-hidden bg-slate-800 transition-all'>
									<img src={authUser.profilePic} alt={authUser.username} />
								</div>
							</div>
						)}
						<span className='font-bold text-lg tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent truncate max-w-[120px] group-hover:opacity-90'>
							{authUser?.fullName || "ChatApp"}
						</span>
					</div>

					<div className='flex items-center gap-1.5'>
						{/* Theme Toggle Button */}
						<button
							onClick={toggleTheme}
							className='btn btn-xs btn-circle bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border-slate-700/60 transition-all shadow-md'
							title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
						>
							{theme === "dark" ? "☀️" : "🌙"}
						</button>

						{/* Dice Avatar Button */}
						<button
							onClick={handleRandomizeMyAvatar}
							className='btn btn-xs btn-circle bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white border-slate-700/60 transition-all shadow-md'
							title='Randomize MY profile picture'
						>
							🎲
						</button>
					</div>
				</div>

				<SearchInput />

				{/* Friend & Group Actions */}
				<div className='mt-2 flex flex-col gap-1.5'>
					<div className='grid grid-cols-2 gap-1.5'>
						<button
							onClick={() => setIsAddFriendOpen(true)}
							className='py-2 px-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 hover:text-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm'
						>
							<IoPersonAddOutline className='w-4 h-4' />
							<span>Add Friend</span>
						</button>

						<button
							onClick={() => setIsRequestsOpen(true)}
							className='py-2 px-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-pink-500/40 text-slate-300 hover:text-pink-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm relative'
						>
							<IoNotificationsOutline className='w-4 h-4' />
							<span>Requests</span>
							{requestCount > 0 && (
								<span className='w-5 h-5 rounded-full bg-pink-500 text-white font-bold text-[10px] flex items-center justify-center shadow-lg animate-pulse'>
									{requestCount}
								</span>
							)}
						</button>
					</div>

					<button
						onClick={() => setIsGroupOpen(true)}
						className='w-full py-1.5 px-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-300 text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-sm'
					>
						<IoPeopleOutline className='w-3.5 h-3.5' />
						<span>New Group Chat</span>
					</button>
				</div>

				<div className='divider my-2 border-slate-700/40'></div>
				<div className='flex-1 overflow-y-auto pr-1'>
					<Conversations />
				</div>
				<div className='pt-3 border-t border-slate-700/40 mt-2'>
					<LogoutButton />
				</div>
			</div>

			{/* Slide-out Profile Drawer */}
			<ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

			{/* New Group Modal */}
			<NewGroupModal isOpen={isGroupOpen} onClose={() => setIsGroupOpen(false)} />

			{/* Add Friend Modal */}
			<AddFriendModal isOpen={isAddFriendOpen} onClose={() => setIsAddFriendOpen(false)} />

			{/* Friend Requests Modal */}
			<FriendRequestsModal
				isOpen={isRequestsOpen}
				onClose={() => setIsRequestsOpen(false)}
				onFriendAdded={() => {
					fetchRequestCount();
					window.location.reload();
				}}
			/>
		</>
	);
};
export default Sidebar;
