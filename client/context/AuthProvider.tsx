import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // connect socket function to handle socket connection

  const connectSocket = (userData: any) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  async function checkAuth() {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  // Login user

  async function login(state: string, credentials: any) {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Logout user
  async function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;

    toast.success("Logged out successfully");
    socket.disconnect();
  }

  //update user profile

  async function updateProfile(body: any) {
    try {
      const { data } = await axios.put(`/api/auth/update-profile`, body);

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile Update successfully");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }

    checkAuth();
  }, [token]);

  const value = {
    axios,
    token,
    authUser,
    onlineUsers,
    socket,

    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
