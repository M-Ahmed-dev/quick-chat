import { createContext } from "react";

interface ChatContext {
  messages: any[];
  users: any[];
  selectedUser: any;
  unSeenMessages: any;

  setUnSeenMessages: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  getUsers: () => Promise<void>;
  setSelectedUser: React.Dispatch<React.SetStateAction<any>>;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  sendMessage: (messageData: any) => Promise<void>;
  getMessages: (userId: any) => Promise<void>;
}

export const ChatContext = createContext<ChatContext | undefined>(undefined);
