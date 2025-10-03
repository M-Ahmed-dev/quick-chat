import { useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { axios, socket } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [unSeenMessages, setUnseenMessages] = useState<Record<string, number>>(
    {}
  );
  // get all chat users
  async function getUsers() {
    try {
      const { data } = await axios.get(`/api/messages/users`);
      console.log("data<<::", data);
      if (data.success) {
        setUsers(data.filteredUsers);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  // get messages for selected user
  async function getMessages(userId) {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  // send message to selected user

  async function sendMessage(messageData) {
    try {
      if (!selectedUser?._id) {
        toast.error("No user selected");
        return;
      }

      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData,
        {
          headers:
            messageData instanceof FormData
              ? { "Content-Type": "multipart/form-data" }
              : { "Content-Type": "application/json" },
        }
      );

      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function subscribeToMessages() {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  }

  //const unsubscribefrom messages

  function unsubscribeFromMessages() {
    if (socket) socket.off("newMessage");
  }

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    unSeenMessages,

    setUnseenMessages,
    getUsers,
    setSelectedUser,
    setMessages,
    sendMessage,
    getMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
