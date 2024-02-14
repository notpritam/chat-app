import ChatMessage from "@/components/chatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useUserStore from "@/lib/store";
import { Send } from "lucide-react";
import React, { useEffect } from "react";

import io from "socket.io-client";

import logoIcon from "../assets/img/chat.png";

const socket = io("http://localhost:3001");

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

function Room() {
  // Variables
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<mesaageType[]>([]);

  const { user } = useUserStore();

  const [currentRoom, setCurrentRoom] = React.useState(
    window.location.pathname.split("/rooms/")[1] == "global"
      ? "global"
      : window.location.pathname.split("/rooms/")[1]
  );

  const handleNewMessage = (newMessage: newMessageRes) => {
    console.log(newMessage.message);
    setMessages((prevMessages) => [...prevMessages, newMessage.message]);
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { room: currentRoom });
  };

  const sendMessage = () => {
    const newMessage: mesaageType = {
      content: message,
      user: user as User,
      room: currentRoom,
    };

    // setMessages((prevMessages) => [...prevMessages, newMessage]);
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

  useEffect(() => {
    socket.on("newMessage", handleNewMessage);

    socket.on("connect", () => {
      console.log(socket.id);
      joinRoom();
    });

    // socket.on("joinedRoom", (room: string) => {
    //   console.log(room, "joined room");
    // });

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off("newMessage", handleNewMessage);
      //   socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen relative h-screen flex overflow-hidden max-h-screen">
      {/* //Header */}

      <div className="p-4 border-r-[1px]">
        <div className="w-full flex items-center justify-center py-4">
          <img src={logoIcon} alt="logo" className="h-12 w-12" />
        </div>
      </div>

      <div className="w-full flex flex-col">
        <div className="h-[80px] shadow">
          <span className="text-3xl font-medium">Messages</span>
        </div>
        <div className="flex flex-col justify-between  gap-4">
          <div className="flex flex-col  w-full gap-4 bg-gray-300  py-4 px-2 ">
            {messages.map((message, index) => (
              <>
                <ChatMessage
                  type={message.user._id === user?._id ? "sent" : "recived"}
                  message={message}
                />
              </>
            ))}
          </div>
        </div>
        <div className="flex px-4 pb-4 gap-2 items-end ">
          <Textarea
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
    </div>
  );
}

export default Room;
