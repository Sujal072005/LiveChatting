import { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import { IoImageOutline, IoClose } from "react-icons/io5";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const EMOJI_LIST = [
	"😀","😂","🤣","😍","🥰","😘","😊","🤗","🤔","😏",
	"😎","🥳","🤩","😤","😡","🥺","😢","😭","😱","🤯",
	"👍","👎","👏","🙌","🤝","💪","🙏","❤️","🔥","⭐",
	"💯","🎉","🎊","✨","💫","🌟","💀","👀","🫡","🤡",
	"💬","💭","🗣️","👋","✌️","🤞","🤟","👊","✊","🫶",
	"😈","👿","💩","🤖","👽","🎃","💋","🫣","🤫","🤭",
	"😴","🥱","😇","🤠","🧐","🤓","😵","🫠","🙃","😉",
	"🍕","☕","🍺","🥂","🍿","🎮","🎯","🚀","💡","📌",
];

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);
	const { loading, sendMessage } = useSendMessage();
	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();
	const [typingTimeout, setTypingTimeout] = useState(null);
	const emojiRef = useRef(null);
	const fileInputRef = useRef(null);

	// Close emoji picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (emojiRef.current && !emojiRef.current.contains(e.target)) {
				setShowEmoji(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleInputChange = (e) => {
		setMessage(e.target.value);
		if (!socket || !selectedConversation?._id) return;

		socket.emit("typing", { receiverId: selectedConversation._id });

		if (typingTimeout) clearTimeout(typingTimeout);

		const timeout = setTimeout(() => {
			socket.emit("stopTyping", { receiverId: selectedConversation._id });
		}, 2000);

		setTypingTimeout(timeout);
	};

	const handleEmojiClick = (emoji) => {
		setMessage((prev) => prev + emoji);
	};

	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			return;
		}

		if (file.size > 3 * 1024 * 1024) {
			return; // max 3MB
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const removeImagePreview = () => {
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message && !imagePreview) return;
		if (socket && selectedConversation?._id) {
			socket.emit("stopTyping", { receiverId: selectedConversation._id });
		}
		await sendMessage(message, imagePreview);
		setMessage("");
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<form className='p-4 bg-slate-900/40 backdrop-blur-md border-t border-slate-700/50' onSubmit={handleSubmit}>
			{/* Image preview */}
			{imagePreview && (
				<div className='image-preview-enter mb-3 relative inline-block'>
					<img
						src={imagePreview}
						alt='Preview'
						className='max-h-32 max-w-[200px] rounded-xl border border-slate-700/60 object-cover'
					/>
					<button
						type='button'
						onClick={removeImagePreview}
						className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-all'
					>
						<IoClose className='w-4 h-4' />
					</button>
				</div>
			)}

			<div className='w-full relative flex items-center gap-2' ref={emojiRef}>
				{/* Emoji picker toggle */}
				<button
					type='button'
					onClick={() => setShowEmoji((prev) => !prev)}
					className='flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700/60 transition-all text-lg'
					title='Emoji Picker'
				>
					😀
				</button>

				{/* Emoji picker popup */}
				{showEmoji && (
					<div className='emoji-picker-popup absolute bottom-14 left-0 w-72 max-h-48 overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl p-3 shadow-2xl z-50'>
						<div className='grid grid-cols-8 gap-1'>
							{EMOJI_LIST.map((emoji, i) => (
								<button
									key={i}
									type='button'
									onClick={() => handleEmojiClick(emoji)}
									className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700/60 text-lg transition-all cursor-pointer'
								>
									{emoji}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Image attachment */}
				<button
					type='button'
					onClick={() => fileInputRef.current?.click()}
					className='flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 border border-slate-700/60 transition-all'
					title='Attach Image'
				>
					<IoImageOutline className='w-5 h-5' />
				</button>
				<input
					type='file'
					accept='image/*'
					ref={fileInputRef}
					onChange={handleImageSelect}
					className='hidden'
				/>

				<div className='flex-1 flex items-center gap-3'>
					<input
						type='text'
						className='w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl py-3 px-4 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner'
						placeholder='Type a message...'
						value={message}
						onChange={handleInputChange}
					/>
					<button
						type='submit'
						className='flex items-center justify-center w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md shadow-indigo-500/25 glow-button transition-all disabled:opacity-50'
						disabled={loading || (!message.trim() && !imagePreview)}
						title='Send Message'
					>
						{loading ? <div className='loading loading-spinner loading-xs'></div> : <BsSend className='w-4 h-4' />}
					</button>
				</div>
			</div>
		</form>
	);
};
export default MessageInput;
