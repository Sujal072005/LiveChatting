import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<div className='mt-auto'>
			{!loading ? (
				<button
					onClick={logout}
					className='flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-sm font-medium'
					title='Log Out'
				>
					<BiLogOut className='w-5 h-5' />
					<span>Log Out</span>
				</button>
			) : (
				<span className='loading loading-spinner loading-sm text-slate-400'></span>
			)}
		</div>
	);
};
export default LogoutButton;
