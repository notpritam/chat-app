import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserStore from "@/lib/store";
import { Send } from "lucide-react";
import React, { useEffect } from "react";

import io from "socket.io-client";

const socket = io("http://localhost:3001");

interface mesaageType {
  content: string;
  user: string;
  room: string;
}

function Home() {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<mesaageType[]>([]);

  const { username, _id } = useUserStore();

  const [currentRoom, setCurrentRoom] = React.useState("global");

  const sendMessage = () => {
    console.log(message);

    socket.emit("sendMessage", {
      room: currentRoom,
      message: {
        content: message,
        user: _id,
      },
    });
  };

  useEffect(() => {
    const handleNewMessage = (newMessage: mesaageType) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);
  return (
    <div className="p-4 flex justify-between gap-4 flex-col h-screen">
      <div className="flex gap-4 flex-col">
        <h1>Chat Page</h1>

        <div className="flex justify-between">
          <Button>Chat Globally</Button>
          <Button>Join Room</Button>
          <Button>Create Room</Button>
        </div>
      </div>

      <div className="flex flex-col w-full bg-gray-300 h-full py-4 px-2 ">
        {messages.map((message, index) => (
          <>
            <div className="p-4 bg-blue-800 text-sm text-white rounded-full rounded-bl-none max-w-[60%]">
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
