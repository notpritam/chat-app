import { Pin } from "lucide-react";
import React from "react";
import ChatListItem from "./chatListItem";

function ChatList() {
  return (
    <div className="w-[20%] h-full hs overflow-hidden overflow-y-scroll relative border-r-[1px]  shadow">
      <div className="flex sticky top-0 bg-white items-center gap-2 p-4 z-[2] border-b-[1px]  text-opacity-50">
        <Pin strokeWidth={0.75} />
        <span className="text-lg font-medium ">All Chats</span>
      </div>

      {Array.from({ length: 20 }).map((item) => (
        <>
          <ChatListItem />
        </>
      ))}
    </div>
  );
}

export default ChatList;
