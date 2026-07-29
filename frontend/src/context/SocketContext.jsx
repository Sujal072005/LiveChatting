import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [typingUsers, setTypingUsers] = useState({});
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socket = io("/", {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			socket.on("userTyping", ({ senderId }) => {
				setTypingUsers((prev) => ({ ...prev, [senderId]: true }));
			});

			socket.on("userStopTyping", ({ senderId }) => {
				setTypingUsers((prev) => ({ ...prev, [senderId]: false }));
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers, typingUsers }}>{children}</SocketContext.Provider>
	);
};
