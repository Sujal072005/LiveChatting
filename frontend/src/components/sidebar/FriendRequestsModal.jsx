import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCheckmark, IoCloseOutline, IoPeopleOutline } from "react-icons/io5";

const FriendRequestsModal = ({ isOpen, onClose, onFriendAdded }) => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(false);
	const [actionLoadingId, setActionLoadingId] = useState(null);

	const fetchRequests = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/friend-requests");
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			setRequests(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			fetchRequests();
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleAccept = async (senderId) => {
		setActionLoadingId(senderId);
		try {
			const res = await fetch(`/api/users/friend-request/accept/${senderId}`, {
				method: "POST",
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			toast.success(data.message || "Friend added!");
			setRequests((prev) => prev.filter((r) => r._id !== senderId));
			if (onFriendAdded) onFriendAdded();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setActionLoadingId(null);
		}
	};

	const handleReject = async (senderId) => {
		setActionLoadingId(senderId);
		try {
			const res = await fetch(`/api/users/friend-request/reject/${senderId}`, {
				method: "POST",
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			toast.success(data.message || "Request declined.");
			setRequests((prev) => prev.filter((r) => r._id !== senderId));
		} catch (error) {
			toast.error(error.message);
		} finally {
			setActionLoadingId(null);
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
			<div className='bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-slate-100'>
				<button
					type='button'
					onClick={onClose}
					className='absolute top-4 right-4 text-slate-400 hover:text-white transition-all'
				>
					<IoClose className='w-6 h-6' />
				</button>

				<div className='flex items-center gap-3 mb-4'>
					<div className='w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center'>
						<IoPeopleOutline className='w-5 h-5' />
					</div>
					<div>
						<h3 className='text-lg font-semibold text-white'>Friend Requests</h3>
						<p className='text-xs text-slate-400'>Accept requests to start chatting</p>
					</div>
				</div>

				<div className='space-y-3 max-h-72 overflow-y-auto pr-1'>
					{loading ? (
						<div className='flex justify-center py-6'>
							<span className='loading loading-spinner loading-md text-indigo-400'></span>
						</div>
					) : requests.length === 0 ? (
						<div className='text-center py-8 text-slate-400 text-sm'>
							No pending friend requests
						</div>
					) : (
						requests.map((sender) => (
							<div
								key={sender._id}
								className='flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50'
							>
								<div className='flex items-center gap-3'>
									<img
										src={sender.profilePic}
										alt={sender.username}
										className='w-10 h-10 rounded-full bg-slate-700/60 object-cover border border-slate-600'
									/>
									<div>
										<h4 className='text-sm font-semibold text-white'>{sender.fullName}</h4>
										<p className='text-xs text-slate-400'>@{sender.username}</p>
									</div>
								</div>

								<div className='flex items-center gap-2'>
									<button
										type='button'
										onClick={() => handleAccept(sender._id)}
										disabled={actionLoadingId === sender._id}
										className='w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all'
										title='Accept'
									>
										<IoCheckmark className='w-4 h-4' />
									</button>
									<button
										type='button'
										onClick={() => handleReject(sender._id)}
										disabled={actionLoadingId === sender._id}
										className='w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all'
										title='Decline'
									>
										<IoCloseOutline className='w-5 h-5' />
									</button>
								</div>
							</div>
						))
					)}
				</div>

				<div className='flex justify-end pt-4 border-t border-slate-800/80 mt-4'>
					<button
						type='button'
						onClick={onClose}
						className='px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all'
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default FriendRequestsModal;
