import ChatList from "@/components/ChatList";
import ChatMessage from "@/components/chatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Send, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

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

interface SelectedRoom {
  name: string;
  id: string;
  image: string;
}

interface initialMessageRes {
  messages: mesaageType[];
  room: string;
  members: User[];
}

const socket = io("http://localhost:3001");

function ChatPage() {
  const { token, storeUser, logOut, user, isAnonymous, storeGlobalChats } =
    useUserStore();
  const navigate = useNavigate();

  if (user == null) {
    navigate("/login");
    return;
  }

  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<mesaageType[]>([]);
  let { id } = useParams();

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

  const handleUserJoined = (details: any) => {};

  // Listending to socket and handiling that

  useEffect(() => {
    console.log("use effect called");
    socket.on("newMessage", handleNewMessage);
    setMessages([]);

    socket.on("connect", () => {
      console.log(socket.id);
      joinRoom();
      // scrollToBottom();
    });
    socket.on("userJoined", handleUserJoined);

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
      socket.off("newMessage", () => {
        console.log("socket newMessage Disconnect");
      });
      socket.off("userJoined", () => {
        console.log("socket userJoined Disconnect");
      });
      socket.off("connect", () => {
        console.log("socket userJoined Disconnect");
      });
      socket.off("error", () => {
        console.log("socket error Disconnect");
      });
      socket.off("intialMessage", () => {
        console.log("socket intialMessage Disconnect");
      });
    };
  }, [id, user]);

  // useEffect(() => {
  //   setMessages([]);
  //   socket.on("connect", () => {
  //     console.log(socket.id);
  //     joinRoom();
  //     // scrollToBottom();
  //   });
  // }, [id]);

  useEffect(() => {
    scrollToBottom();

    return () => {
      socket.off("connect");
    };
  }, [message, messages]);

  return (
    <div className="flex flex-col h-full w-full justify-end relative   bg-white bg-opacity-10 backdrop-filter backdrop-blur-3xl border border-gray-200  rounded-md shadow-md">
      <div
        className="absolute bg-cover bg-center z-[0] h-full w-full top-0 left-0 right-0 bottom-0"
        style={{
          backgroundImage:
            "url(https://4kwallpapers.com/images/walls/thumbs_3t/6420.jpg)",
        }}
      ></div>
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
      <div className="flex relative w-full gap-2 items-end p-4 pb-2 backdrop-blur-3xl bg-transparent border-t-[1px]  ">
        <EmojiPicker
          className="fixed -top-8 left-0"
          open={emojiOpen}
          onEmojiClick={(e) => {
            console.log(e.emoji);
            setMessage((message) => message + e.emoji);
          }}
        />
        <Smile
          className="text-white"
          onClick={() => [setEmojiOpen(!emojiOpen)]}
          strokeWidth={0.75}
        />
        <Paperclip className="text-white" strokeWidth={0.75} />
        <form className="flex w-full gap-2 text-white">
          <Input
            placeholder="Type a message"
            className="text-gray-100 bg-transparent border-b-[1px] border-gray-100 w-full"
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
