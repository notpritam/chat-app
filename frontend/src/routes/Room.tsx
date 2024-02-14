import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserStore from "@/lib/store";
import { Send } from "lucide-react";
import React, { useEffect } from "react";

import io from "socket.io-client";

const socket = io("http://localhost:3001");

interface mesaageType {
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
    <div className="min-h-screen">
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col w-full gap-4 bg-gray-300 h-full py-4 px-2 ">
          {messages.map((message, index) => (
            <>
              <div className="p-4 bg-blue-800 text-sm text-white rounded-full rounded-bl-none max-w-[60%]">
                <img
                  className="h-[20px] w-[20px] rounded-full"
                  src={message.user.image}
                  alt="message"
                />{" "}
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
    </div>
  );
}

export default Room;
