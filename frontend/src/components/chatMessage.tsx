import { cn } from "@/lib/utils";
import { mesaageType } from "@/routes/ChatPage";

interface ChatMessageProps {
  type: string;
  message: mesaageType;
}

function ChatMessage({ type, message }: ChatMessageProps) {
  const formattedTime = (time: string) => {
    const timestamp = time;

    if (!timestamp) {
      return;
    }

    const date = new Date(timestamp);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(date);

    return formattedTime;
  };

  return (
    <div
      className={cn(
        "flex gap-2 items-start",
        type == "sent" ? "justify-end" : ""
      )}
    >
      {type == "sent" ? null : (
        <img
          className="h-[32px] w-[32px] rounded-full"
          src={message.user.image}
          alt="message"
        />
      )}
      <div
        className={cn(
          "flex gap-2 flex-col w-full ",
          type === "sent" ? "items-end " : "items-start "
        )}
      >
        <div
          className={cn(
            "px-4 py-2 text-sm rounded-3xl items-start shadow-md border-opacity-10 bg-white  text-white flex flex-col  gap-2 w-auto max-w-[60%] bg-opacity-10 backdrop-filter backdrop-blur-3xl border border-gray-50 ",
            type === "sent" ? "rounded-br-none  " : "rounded-bl-none "
          )}
        >
          {type == "sent" ? null : (
            <span className=" text-gray-300 md:text-[1rem] text-[12px] truncate">
              {message.user.name}
            </span>
          )}
          <p className="lg:text-lg text-white">{message.content}</p>
        </div>
        <span className="text-[10px] lg:text-[12px] text-white opacity-55">
          {formattedTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
