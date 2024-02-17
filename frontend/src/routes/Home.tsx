import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserStore from "@/lib/store";
import { Send } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import io from "socket.io-client";

const socket = io("https://chat-app-backend-0v3j.onrender.com/");

interface mesaageType {
  content: string;
  user: string;
  room: string;
}

interface newMessageRes {
  message: mesaageType;
  user: User;
}

interface User {
  username: string;
  _id: string;
  name: string;
  image: string;
}

function Home() {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<mesaageType[]>([]);
  const navigate = useNavigate();

  const { user } = useUserStore();

  const [currentRoom, setCurrentRoom] = React.useState("global");

  const sendMessage = () => {
    console.log(message);
    setCurrentRoom(currentRoom);

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

  const handleNewMessage = (newMessage: newMessageRes) => {
    console.log(newMessage.message);
    setMessages((prevMessages) => [...prevMessages, newMessage.message]);
  };

  const joinGlobalRoom = () => {
    socket.emit("joinRoom", { room: currentRoom });
  };

  useEffect(() => {
    socket.on("newMessage", handleNewMessage);

    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("joinedRoom", (room: string) => {
      console.log(room, "joined room");
      navigate("/rooms/" + room);
    });

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off("newMessage", handleNewMessage);
      //   socket.disconnect();
    };
  }, []);
  return (
    <div className="p-4 flex justify-between gap-4 flex-col h-screen">
      <div className="flex gap-4 flex-col">
        <h1>Chat Page</h1>

        <div className="flex justify-between">
          <Button onClick={joinGlobalRoom}>Chat Globally</Button>
          <Button>Join Room</Button>
          <Button>Create Room</Button>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 bg-gray-300 h-full py-4 px-2 ">
        {messages.map((message, index) => (
          <>
            <div
              key={index}
              className="p-4 bg-blue-800 text-sm text-white rounded-full rounded-bl-none max-w-[60%]"
            >
              <p>{message.content}</p>
            </div>
          </>
        ))}
      </div>

      <div className="flex ">
        <Input
          type="text"
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

export default Home;
