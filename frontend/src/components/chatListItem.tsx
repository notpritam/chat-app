import React from "react";
import { Link } from "react-router-dom";

interface RoomDetails {
  name: string;
  image: string;
}

function ChatListItem({ name, image }: RoomDetails) {
  return (
    <a href={`http://localhost:5173/rooms/${name}`}>
      <div className="w-full p-4  flex gap-4 bg-white border-[1px]">
        <img
          src="https://chatfaitdubien.fr/wp-content/uploads/2016/11/4637-deux-chatons-WallFizz.jpg"
          className="h-[48px] w-[48px] rounded-full"
        />
        <div className="flex gap-1 w-full flex-col">
          <div className="flex justify-between">
            <span className="font-bold">Title</span>
            <span>4:30</span>
          </div>
          <span className="text-sm opacity-55">Click to see messages</span>
        </div>
      </div>
    </a>
  );
}

export default ChatListItem;
