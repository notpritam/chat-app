import { Link, useParams } from "react-router-dom";
import { RoomDetails } from "./ChatList";
import { cn } from "@/lib/utils";

interface ChatListProps {
  room: RoomDetails;
  setSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChatListItem({ room, setSideBar }: ChatListProps) {
  const { id } = useParams();
  return (
    <Link
      onClick={() => {
        setSideBar(false);
      }}
      to={`https://chat-app-backend-0v3j.onrender.com/rooms/${room.name}`}
    >
      <div
        className={cn(
          "w-full p-4  flex gap-4 bg-white border-[1px]  bg-opacity-30 backdrop-filter backdrop-blur-3xl  border-gray-200",
          id === room.name ? "border-r-2 bg-purple-400 bg-opacity-70" : ""
        )}
      >
        <img
          src={room.image}
          className={cn(
            "h-[48px] w-[48px] rounded-full",
            room.name == "global" ? "rounded-none" : null
          )}
        />
        <div className="flex gap-1 w-full flex-col">
          <div className="flex justify-between">
            <span className="font-bold uppercase">{room.name}</span>
            <span>4:30</span>
          </div>
          <span className="text-sm opacity-55">
            {room.members.length} Members
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ChatListItem;
