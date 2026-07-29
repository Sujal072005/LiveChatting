import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoPersonAddOutline } from "react-icons/io5";

const AddFriendModal = ({ isOpen, onClose }) => {
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSendRequest = async (e) => {
		e.preventDefault();
		if (!username.trim()) {
			toast.error("Please enter a username");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/users/friend-request/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: username.trim() }),
			});
			const data = await res.json();

			if (data.error) {
				throw new Error(data.error);
			}

			toast.success(data.message || "Friend request sent!");
			setUsername("");
			onClose();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
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
					<div className='w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center'>
						<IoPersonAddOutline className='w-5 h-5' />
					</div>
					<div>
						<h3 className='text-lg font-semibold text-white'>Add Friend</h3>
						<p className='text-xs text-slate-400'>Enter a username to send a friend request</p>
					</div>
				</div>

				<form onSubmit={handleSendRequest} className='space-y-4'>
					<div>
						<label className='label'>
							<span className='text-xs font-medium text-slate-300'>Username</span>
						</label>
						<div className='relative'>
							<span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold'>@</span>
							<input
								type='text'
								placeholder='e.g. sujal'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='w-full bg-slate-800/80 border border-slate-700/80 rounded-xl py-2.5 pl-8 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all'
							/>
						</div>
					</div>

					<div className='flex justify-end gap-3 pt-2'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all'
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={loading || !username.trim()}
							className='px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50'
						>
							{loading ? "Sending..." : "Send Request"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddFriendModal;
