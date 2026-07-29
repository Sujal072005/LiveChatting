import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className='flex h-[88vh] max-h-[820px] w-full max-w-6xl rounded-3xl overflow-hidden glass-panel border border-slate-700/60 shadow-2xl transition-all duration-300'>
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;
