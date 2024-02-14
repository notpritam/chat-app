import { Pin } from "lucide-react";
import React, { useEffect, useState } from "react";
import ChatListItem from "./chatListItem";
import { faker } from "@faker-js/faker";
import useUserStore from "@/lib/store";
import { Button } from "./ui/button";

export interface RoomDetails {
  name: string;
  image: string;
  members: members[];
  // messages: messages[];
}

interface members {
  name: string;
  username: string;
  image: string;
}

interface messages {
  content: string;
  sender: string;
  createdAt: string;
}

interface RoomListResponse {
  rooms: RoomDetails[];
}

function ChatList() {
  const [joinedRooms, setJoinedRooms] = useState<RoomDetails[]>([]);
  const { user, token, isAnonymous } = useUserStore();

  const getRoomsList = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/rooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const data: any = await res.json();

      if (res.status == 200) {
        if (data) {
          setJoinedRooms([...data] as any);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isAnonymous) {
      return;
    } else {
      getRoomsList();
    }
  }, []);

  return (
    <div className="w-[20%] h-full hs overflow-hidden overflow-y-scroll relative border-r-[1px]  shadow">
      <div className="flex sticky top-0 bg-white items-center gap-2 p-4 z-[2] border-b-[1px]  text-opacity-50">
        <Pin strokeWidth={0.75} />
        <span className="text-lg font-medium ">All Chats</span>
      </div>

      {joinedRooms?.map((item, index) => (
        <ChatListItem
          key={index}
          name={item.name}
          members={item.members}
          image={item.image}
        />
      ))}

      {joinedRooms.length == 0 && (
        <>
          {!isAnonymous && (
            <div className="p-4">
              <span>No Rooms Joined</span>
            </div>
          )}
          <div>
            {isAnonymous && (
              <div className="p-4">
                <span>
                  No Private Rooms for Anonymous User. Create an account first.
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ChatList;
