import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => {
	return useContext(ThemeContext);
};

export const ThemeContextProvider = ({ children }) => {
	const [theme, setTheme] = useState(localStorage.getItem("chat-theme") || "dark");

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		localStorage.setItem("chat-theme", newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
