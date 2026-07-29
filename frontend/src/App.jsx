import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import { useThemeContext } from "./context/ThemeContext";

function App() {
	const { authUser } = useAuthContext();
	const { theme } = useThemeContext();
	return (
		<div className={`${theme === "light" ? "theme-light" : ""} p-4 h-screen flex items-center justify-center relative overflow-hidden`}>
			{/* Animated floating background orbs */}
			<div className='floating-orb orb-1'></div>
			<div className='floating-orb orb-2'></div>
			<div className='floating-orb orb-3'></div>

			<Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
