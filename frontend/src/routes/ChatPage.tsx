import ChatMessage from "@/components/chatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store";
import EmojiPicker from "emoji-picker-react";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "./Layout";

export interface mesaageType {
  content: string;
  user: User;
  sender?: User;
  room: string;
  createdAt: string;
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

interface initialMessageRes {
  messages: mesaageType[];
  room: string;
  members: User[];
}
function ChatPage() {
  const { user, storeGlobalChats } = useUserStore();
  const navigate = useNavigate();

  if (user == null) {
    navigate("/login");
    return;
  }

  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<mesaageType[]>([]);
  let { id } = useParams();

  const [currentRoom, setCurrentRoom] = useState("");

  // console.log("this is current room", id);

  const [emojiOpen, setEmojiOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessage = (newMessage: newMessageRes) => {
    console.log(newMessage, "new message");

    setMessages((prevMessages) => [...prevMessages, newMessage.message]);
    storeGlobalChats(newMessage.message);
  };

  function generateTimestamp() {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  const joinRoom = () => {
    socket.emit("joinRoom", { room: id, user: user });
  };

  const sendMessage = (event: any) => {
    event?.preventDefault();
    setEmojiOpen(false);

    socket.emit("sendMessage", {
      room: id,
      message: {
        content: message,
        user: user?._id,
        room: id,
        createdAt: generateTimestamp(),
      },
      user,
    });
    setMessage("");
  };

  const handleUserJoined = (details: any) => {
    console.log(details, "user joined");
  };

  // Listending to socket and handiling that

  useEffect(() => {
    console.log("use effect called");

    if (id == currentRoom) {
      console.log("still in current room");
    } else {
      console.log("changing room to", id);
      setCurrentRoom(id as string);
      setMessages([]);
      joinRoom();
    }

    socket.on("connect", () => {
      console.log(socket.id, "connecting here");
      joinRoom();
    });

    socket.on("userJoined", handleUserJoined);
    socket.on("newMessage", handleNewMessage);

    socket.on("error", (message: string) => {
      console.log(message);
      toast({
        title: "Error",
        description: message,
      });

      navigate("/rooms/global");
    });

    socket.on("intialMessage", (res: initialMessageRes) => {
      console.log(res, "initial message");

      const formattedMessages = res.messages.map((singleMessage) => {
        return {
          content: singleMessage.content,
          user: singleMessage.sender as User,
          room: id as string,
          createdAt: singleMessage.createdAt,
        };
      });

      setMessages([...formattedMessages]);
    });

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [message, messages]);

  return (
    <div className="flex flex-col h-full w-full justify-end relative   bg-black bg-opacity-10 backdrop-filter  border   rounded-md ">
      <div className="flex flex-col z-10  w-full gap-4 overflow-y-auto overflow-hidden  hs  py-4 px-2 ">
        {messages?.map((message, index) => (
          <ChatMessage
            key={index}
            type={message.user._id === user?._id ? "sent" : "recived"}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex relative w-full gap-2 items-end p-4 pb-2 bg-black bg-opacity-50 backdrop-filter backdrop-blur-3xl border-t-[1px] border-gray-200 ">
        <EmojiPicker
          className="fixed -top-8 left-0"
          open={emojiOpen}
          onEmojiClick={(e) => {
            console.log(e.emoji);
            setMessage((message) => message + e.emoji);
          }}
        />
        {/* <Smile
          className="text-white"
          onClick={() => [setEmojiOpen(!emojiOpen)]}
          strokeWidth={0.75}
        />
        <Paperclip className="text-white" strokeWidth={0.75} /> */}
        <form className="flex w-full gap-2 text-white">
          <Input
            placeholder="Type a message"
            className="text-gray-100 bg-transparent border-b-[1px]  w-full border-none focus-visible:ring-0"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button
            type="submit"
            className="bg-transparent"
            onClick={sendMessage}
          >
            <Send className="text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
