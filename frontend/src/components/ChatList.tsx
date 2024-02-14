import { Pin } from "lucide-react";
import React, { useEffect, useState } from "react";
import ChatListItem from "./chatListItem";
import { faker } from "@faker-js/faker";
import useUserStore from "@/lib/store";
import { Button } from "./ui/button";

interface Rooms {
  name: string;
  image: string;
  members: members[];
}

interface members {
  name: string;
  username: string;
  image: string;
}

function ChatList() {
  const [joinedRooms, setJoinedRooms] = useState([]);
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

      const data = await res.json();

      if (res.status == 200) {
        console.log(data);

        if (data) {
          setJoinedRooms([]);
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
        <>
          <ChatListItem name={`room${index}`} image={faker.image.avatar()} />
        </>
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
                  No Private Rooms or Anonymous User. Create an account first.
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
