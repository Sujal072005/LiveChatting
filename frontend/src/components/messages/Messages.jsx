import { useEffect, useRef, useState } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { IoArrowDown } from "react-icons/io5";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();
	const containerRef = useRef();
	const [showScrollBtn, setShowScrollBtn] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	const handleScroll = () => {
		if (!containerRef.current) return;
		const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		setShowScrollBtn(distanceFromBottom > 150);
	};

	const scrollToBottom = () => {
		lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div
			className='px-4 flex-1 overflow-auto relative'
			ref={containerRef}
			onScroll={handleScroll}
		>
			{!loading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<div className='flex flex-col items-center justify-center h-full gap-3 opacity-60'>
					<svg width='64' height='64' viewBox='0 0 64 64' fill='none' className='animate-pulse'>
						<rect x='8' y='12' width='48' height='36' rx='8' stroke='url(#msgGrad)' strokeWidth='2' fill='rgba(99,102,241,0.05)' />
						<path d='M20 52 L32 40 L44 52' stroke='url(#msgGrad)' strokeWidth='2' fill='none' strokeLinejoin='round' />
						<circle cx='24' cy='28' r='2' fill='rgba(99,102,241,0.5)' />
						<circle cx='32' cy='28' r='2' fill='rgba(139,92,246,0.5)' />
						<circle cx='40' cy='28' r='2' fill='rgba(236,72,153,0.5)' />
						<defs>
							<linearGradient id='msgGrad' x1='0' y1='0' x2='64' y2='64'>
								<stop offset='0%' stopColor='#6366f1' />
								<stop offset='100%' stopColor='#ec4899' />
							</linearGradient>
						</defs>
					</svg>
					<p className='text-sm text-slate-400 font-medium'>Send a message to start the conversation</p>
				</div>
			)}

			{/* Scroll to bottom floating button */}
			{showScrollBtn && (
				<button
					onClick={scrollToBottom}
					className='scroll-to-bottom-btn fixed bottom-28 right-8 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 z-50 border border-indigo-400/30'
				>
					<IoArrowDown className='w-5 h-5' />
				</button>
			)}
		</div>
	);
};
export default Messages;
