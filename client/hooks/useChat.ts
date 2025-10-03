import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useChat;
