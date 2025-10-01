import axios from "axios";
import { createContext, useContext } from "react";

export type AuthContextType = {
  axios: typeof axios;
  token: string | null;
  authUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  onlineUsers: any[];
  socket: WebSocket | null;

  login: (state: string, credentials: any) => Promise<void>;
  logout: () => void;
  updateProfile: (body: any) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
