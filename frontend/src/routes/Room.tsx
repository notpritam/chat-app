import useUserStore from "@/lib/store";
import {
  CircleFadingPlus,
  Globe,
  LogOut,
  MessageSquareMore,
  Paperclip,
  Pin,
  Send,
  Smile,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import io from "socket.io-client";

import logoIcon from "../assets/img/chat.png";
import ChatListItem from "@/components/chatListItem";
import ChatList from "@/components/ChatList";
import { toast } from "@/components/ui/use-toast";
import {
  Link,
  Outlet,
  redirect,
  redirectDocument,
  useNavigate,
  useParams,
} from "react-router-dom";
import ChatPage from "./ChatPage";

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

interface SelectedRoom {
  name: string;
  id: string;
  image: string;
}

function Room() {
  // Variables

  const { user, isAnonymous, logOut } = useUserStore();
  const navigate = useNavigate();
  let { id } = useParams();

  const [currentRoom, setCurrentRoom] = React.useState(id);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="w-full h-full flex flex-col">
      <div className="h-[80px] p-4 shadow border-b-[1px]">
        <span className="text-3xl font-medium">Messages</span>
      </div>

      <div className="flex h-full overflow-hidden hs  ">
        {currentRoom === "global" ? null : <ChatList />}

        {/* Chat Area */}
        <ChatPage />
      </div>
    </div>
  );
}

export default Room;
