import { useAuthContext } from "../../context/AuthContext";

const ProfileDrawer = ({ isOpen, onClose }) => {
	const { authUser } = useAuthContext();

	if (!isOpen || !authUser) return null;

	const memberSince = new Date(authUser.createdAt || Date.now()).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className='profile-drawer-overlay fixed inset-0 z-50 flex' onClick={onClose}>
			<div
				className='profile-drawer-panel w-80 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/60 shadow-2xl flex flex-col'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='p-6 border-b border-slate-700/40'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-lg font-bold text-white'>My Profile</h2>
						<button
							onClick={onClose}
							className='w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all text-sm'
						>
							✕
						</button>
					</div>
				</div>

				{/* Avatar */}
				<div className='flex flex-col items-center py-8 px-6'>
					<div className='avatar mb-4'>
						<div className='w-24 h-24 rounded-full ring-4 ring-indigo-500/40 ring-offset-4 ring-offset-slate-900 overflow-hidden bg-slate-800'>
							<img src={authUser.profilePic} alt={authUser.fullName} />
						</div>
					</div>
					<h3 className='text-xl font-bold text-white mb-0.5'>{authUser.fullName}</h3>
					<p className='text-sm text-indigo-400 font-medium'>@{authUser.username}</p>
				</div>

				{/* Info cards */}
				<div className='px-6 space-y-3 flex-1'>
					<div className='bg-slate-800/60 rounded-xl p-3 border border-slate-700/40'>
						<p className='text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1'>Gender</p>
						<p className='text-sm text-slate-200 font-medium capitalize'>{authUser.gender || "Not set"}</p>
					</div>
					<div className='bg-slate-800/60 rounded-xl p-3 border border-slate-700/40'>
						<p className='text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1'>Member Since</p>
						<p className='text-sm text-slate-200 font-medium'>{memberSince}</p>
					</div>
					<div className='bg-slate-800/60 rounded-xl p-3 border border-slate-700/40'>
						<p className='text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1'>User ID</p>
						<p className='text-xs text-slate-400 font-mono truncate'>{authUser._id}</p>
					</div>
				</div>

				{/* Footer */}
				<div className='p-6 border-t border-slate-700/40'>
					<p className='text-[10px] text-slate-500 text-center'>ChatApp • Secure Real-Time Messaging</p>
				</div>
			</div>

			{/* Click outside overlay area */}
			<div className='flex-1' />
		</div>
	);
};

export default ProfileDrawer;
