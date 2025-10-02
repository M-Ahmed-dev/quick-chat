import axios from "axios";
import { createContext } from "react";

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  bio: string;
}
export interface AuthContextType {
  axios: typeof axios;
  token: string | null;
  authUser: {
    fullName: string;
    bio: string;
    email: string;
  } | null;
  onlineUsers: any[];
  socket: WebSocket | null;

  login: (state: string, credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (body: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
