import { useState } from "react";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const NewGroupModal = ({ isOpen, onClose }) => {
	const { conversations } = useGetConversations();
	const [groupName, setGroupName] = useState("");
	const [selectedMembers, setSelectedMembers] = useState([]);
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleToggleMember = (userId) => {
		if (selectedMembers.includes(userId)) {
			setSelectedMembers(selectedMembers.filter((id) => id !== userId));
		} else {
			setSelectedMembers([...selectedMembers, userId]);
		}
	};

	const handleCreateGroup = (e) => {
		e.preventDefault();
		if (!groupName.trim()) {
			return toast.error("Please enter a group name");
		}
		if (selectedMembers.length < 2) {
			return toast.error("Select at least 2 members for a group chat");
		}

		setLoading(true);
		setTimeout(() => {
			toast.success(`Group "${groupName}" created!`);
			setLoading(false);
			setGroupName("");
			setSelectedMembers([]);
			onClose();
		}, 600);
	};

	return (
		<div className='modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
			<div className='modal-panel w-full max-w-md bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 shadow-2xl'>
				<div className='flex items-center justify-between mb-4 border-b border-slate-700/40 pb-3'>
					<h3 className='text-lg font-bold text-white'>Create New Group</h3>
					<button
						onClick={onClose}
						className='w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all text-sm'
					>
						✕
					</button>
				</div>

				<form onSubmit={handleCreateGroup} className='space-y-4'>
					<div>
						<label className='label p-1'>
							<span className='text-xs font-semibold text-slate-300 uppercase tracking-wider'>Group Name</span>
						</label>
						<input
							type='text'
							placeholder='e.g. Weekend Trip 🎉'
							className='w-full input bg-slate-800/80 border border-slate-700/80 rounded-xl h-10 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all'
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
						/>
					</div>

					<div>
						<label className='label p-1'>
							<span className='text-xs font-semibold text-slate-300 uppercase tracking-wider'>
								Select Members ({selectedMembers.length})
							</span>
						</label>
						<div className='max-h-48 overflow-y-auto space-y-1 pr-1 bg-slate-950/40 rounded-2xl p-2 border border-slate-800'>
							{conversations.map((user) => {
								const isSelected = selectedMembers.includes(user._id);
								return (
									<div
										key={user._id}
										onClick={() => handleToggleMember(user._id)}
										className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
											isSelected
												? "bg-indigo-600/30 border border-indigo-500/40 text-white"
												: "hover:bg-slate-800/60 text-slate-300"
										}`}
									>
										<div className='flex items-center gap-2.5'>
											<div className='avatar'>
												<div className='w-8 h-8 rounded-full'>
													<img src={user.profilePic} alt={user.fullName} />
												</div>
											</div>
											<span className='text-sm font-medium'>{user.fullName}</span>
										</div>
										<input
											type='checkbox'
											checked={isSelected}
											onChange={() => {}}
											className='checkbox checkbox-sm checkbox-primary border-slate-600 rounded'
										/>
									</div>
								);
							})}
						</div>
					</div>

					<div className='pt-2 flex gap-2'>
						<button
							type='button'
							onClick={onClose}
							className='btn flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border-none transition-all'
						>
							Cancel
						</button>
						<button
							type='submit'
							className='btn flex-1 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold border-none shadow-lg shadow-indigo-500/25 glow-button transition-all'
							disabled={loading}
						>
							{loading ? <span className='loading loading-spinner loading-xs'></span> : "Create Group"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default NewGroupModal;
