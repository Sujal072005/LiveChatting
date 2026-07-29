import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-[380px] sm:min-w-[440px] mx-auto page-transition relative z-10'>
			<div className='w-full p-8 rounded-3xl glass-panel border border-slate-700/60 transition-all duration-300'>
				<div className='text-center mb-6'>
					<h1 className='text-3xl font-bold tracking-tight text-white mb-1'>
						Create Account on
						<span className='bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ml-2'>
							ChatApp
						</span>
					</h1>
					<p className='text-xs text-slate-400'>Join instant real-time messaging today</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-3'>
					<div>
						<label className='label p-1'>
							<span className='text-sm font-medium text-slate-300'>Full Name</span>
						</label>
						<input
							type='text'
							placeholder='John Doe'
							className='w-full input bg-slate-800/60 border border-slate-700/80 rounded-xl h-10 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all'
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</div>

					<div>
						<label className='label p-1'>
							<span className='text-sm font-medium text-slate-300'>Username</span>
						</label>
						<input
							type='text'
							placeholder='johndoe'
							className='w-full input bg-slate-800/60 border border-slate-700/80 rounded-xl h-10 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
					</div>

					<div>
						<label className='label p-1'>
							<span className='text-sm font-medium text-slate-300'>Password</span>
						</label>
						<div className='relative'>
							<input
								type={showPassword ? "text" : "password"}
								placeholder='••••••••'
								className='w-full input bg-slate-800/60 border border-slate-700/80 rounded-xl h-10 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all pr-11'
								value={inputs.password}
								onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors'
								tabIndex={-1}
							>
								{showPassword ? <IoEyeOffOutline className='w-5 h-5' /> : <IoEyeOutline className='w-5 h-5' />}
							</button>
						</div>
					</div>

					<div>
						<label className='label p-1'>
							<span className='text-sm font-medium text-slate-300'>Confirm Password</span>
						</label>
						<div className='relative'>
							<input
								type={showConfirmPassword ? "text" : "password"}
								placeholder='••••••••'
								className='w-full input bg-slate-800/60 border border-slate-700/80 rounded-xl h-10 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all pr-11'
								value={inputs.confirmPassword}
								onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
							/>
							<button
								type='button'
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors'
								tabIndex={-1}
							>
								{showConfirmPassword ? <IoEyeOffOutline className='w-5 h-5' /> : <IoEyeOutline className='w-5 h-5' />}
							</button>
						</div>
					</div>

					<div className='pt-1'>
						<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
					</div>

					<div className='pt-1'>
						<Link
							to={"/login"}
							className='text-xs text-slate-400 hover:text-indigo-400 transition-colors inline-block'
						>
							Already have an account? <span className='underline underline-offset-4'>Sign in</span>
						</Link>
					</div>

					<div className='pt-2'>
						<button
							className='btn btn-block h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold border-none shadow-lg shadow-indigo-500/25 glow-button disabled:opacity-50 transition-all'
							disabled={loading}
						>
							{loading ? <span className='loading loading-spinner loading-sm'></span> : "Create Account"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;
