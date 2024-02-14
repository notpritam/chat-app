import ChatList from "@/components/ChatList";
import ChatMessage from "@/components/chatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Send, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export interface mesaageType {
  content: string;
  user: User;
  room: string;
}
interface newMessageRes {
  message: mesaageType;
}

interface User {
  username: string;
  _id: string;
  name: string;
  image: string;
}

interface SelectedRoom {
  name: string;
  id: string;
  image: string;
}

const socket = io("http://localhost:3001");

function ChatPage() {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<mesaageType[]>([]);

  const [emojiOpen, setEmojiOpen] = useState(false);
  const { user, isAnonymous } = useUserStore();
  const navigate = useNavigate();

  const [currentRoom, setCurrentRoom] = React.useState(
    window.location.pathname.split("/rooms/")[1] == "global"
      ? "global"
      : window.location.pathname.split("/rooms/")[1]
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessage = (newMessage: newMessageRes) => {
    console.log(newMessage.message);
    setMessages((prevMessages) => [...prevMessages, newMessage.message]);
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { room: currentRoom, user: user });
  };

  const sendMessage = () => {
    const newMessage: mesaageType = {
      content: message,
      user: user as User,
      room: currentRoom,
    };

    // setMessages((prevMessages) => [...prevMessages, newMessage]);

    setMessage("");
    socket.emit("sendMessage", {
      room: currentRoom,
      message: {
        content: message,
        user: user?._id,
        room: currentRoom,
      },
      user,
    });
  };

  const handleUserJoined = (details: any) => {
    console.log(details, "user joined");

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: details.message,
        user: {} as User,
        room: details.room as string,
      },
    ]);
  };

  // Listending to socket and handiling that

  useEffect(() => {
    socket.on("newMessage", handleNewMessage);

    socket.on("connect", () => {
      console.log(socket.id);
      joinRoom();
      scrollToBottom();
    });
    socket.on("userJoined", handleUserJoined);

    // socket.on("joinedRoom", (room: string) => {
    //   console.log(room, "joined room");
    // });

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off("newMessage", handleNewMessage);
      //   socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentRoom != "global" && isAnonymous) {
      toast({
        title: "Login First",
        description: " You are not allowed , Login First",
      });

      navigate("/login");
    }
  }, []);
  return (
    <div className="flex flex-col h-full w-full justify-between ">
      <div
        ref={messagesEndRef}
        className="flex flex-col h-full bg-blue-500 w-full gap-4 overflow-y-auto overflow-hidden hs  py-4 px-2 "
      >
        {messages.map((message, index) => (
          <>
            <ChatMessage
              type={message.user._id === user?._id ? "sent" : "recived"}
              message={message}
            />
          </>
        ))}
      </div>
      <div className="flex relative w-full gap-2 items-end p-4 pb-2  ">
        <EmojiPicker
          className="fixed -top-8 left-0"
          open={emojiOpen}
          onEmojiClick={(e) => {
            console.log(e.emoji);
            setMessage((message) => message + e.emoji);
          }}
        />
        <Smile onClick={() => [setEmojiOpen(!emojiOpen)]} strokeWidth={0.75} />
        <Paperclip strokeWidth={0.75} />
        <Input
          placeholder="Type a message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Button onClick={sendMessage}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatPage;
